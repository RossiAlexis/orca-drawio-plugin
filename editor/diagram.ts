export type Diagram = { kind: 'empty' } | { kind: 'diagram'; xml: string }

export class NotADiagramError extends Error {}

const SVG_START = /^\s*(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i

/** The draw.io XML in a `.drawio` file, or the copy draw.io stores in an editable `.drawio.svg`. */
export function readDiagram(text: string): Diagram {
  if (text.trim() === '') {
    return { kind: 'empty' }
  }
  if (!SVG_START.test(text)) {
    return { kind: 'diagram', xml: text }
  }
  const rootTag = text.slice(text.search(/<svg[\s>]/i), text.indexOf('>', text.search(/<svg[\s>]/i)) + 1)
  const content = /\scontent="([^"]*)"/.exec(rootTag)?.[1]
  if (!content) {
    throw new NotADiagramError(
      'This SVG has no draw.io diagram inside. In draw.io, export it with "Include a copy of my diagram" or save it as .drawio.svg.'
    )
  }
  return { kind: 'diagram', xml: decodeXmlEntities(content) }
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}
