import { assert, test } from 'orca/testing'
import { NotADiagramError, readDiagram } from './diagram.ts'

const MXFILE = '<mxfile host="app.diagrams.net"><diagram id="a" name="Page-1"><mxGraphModel/></diagram></mxfile>'

test('a .drawio file is shown as it is', () => {
  assert.deepEqual(readDiagram(MXFILE), { kind: 'diagram', xml: MXFILE })
})

test('a new, empty file shows the empty state', () => {
  assert.deepEqual(readDiagram('  \n'), { kind: 'empty' })
})

test('a .drawio.svg shows the diagram stored in its content attribute', () => {
  const escaped = MXFILE.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "x">\n<svg xmlns="http://www.w3.org/2000/svg" content="${escaped}" width="10"><rect/></svg>`
  assert.deepEqual(readDiagram(svg), { kind: 'diagram', xml: MXFILE })
})

test('numeric entities in the stored diagram are decoded', () => {
  const svg = '<svg content="&lt;mxfile&gt;caf&#233; &#x2192; ok&lt;/mxfile&gt;"></svg>'
  assert.deepEqual(readDiagram(svg), { kind: 'diagram', xml: '<mxfile>café → ok</mxfile>' })
})

test('a content attribute on an inner element is not mistaken for the diagram', () => {
  assert.throws(() => readDiagram('<svg width="1"><g content="&lt;mxfile/&gt;"/></svg>'), NotADiagramError)
})

test('a plain SVG says how to get an editable one', () => {
  assert.throws(() => readDiagram('<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'), /Include a copy of my diagram/)
})
