import { NotADiagramError, readDiagram } from './diagram.ts'

type GraphViewerGlobal = {
  createViewerForElement(element: HTMLElement, callback?: (viewer: unknown) => void): void
}
declare const GraphViewer: GraphViewerGlobal

const root = document.getElementById('root') as HTMLElement

function showMessage(title: string, detail: string) {
  const message = document.createElement('div')
  message.className = 'message'
  const heading = document.createElement('strong')
  heading.textContent = title
  message.append(heading, detail)
  root.replaceChildren(message)
}

function render(text: string) {
  let diagram
  try {
    diagram = readDiagram(text)
  } catch (error) {
    if (error instanceof NotADiagramError) {
      showMessage('Nothing to show', error.message)
      return
    }
    throw error
  }
  if (diagram.kind === 'empty') {
    showMessage('Empty diagram', 'This file has no diagram yet. Draw it in draw.io and it shows up here.')
    return
  }

  const container = document.createElement('div')
  container.className = 'diagram'
  container.dataset.mxgraph = JSON.stringify({
    xml: diagram.xml,
    toolbar: 'zoom layers pages',
    'toolbar-nohide': true,
    nav: true,
    resize: true,
    lightbox: false,
    highlight: '#0000ff'
  })
  root.replaceChildren(container)
  GraphViewer.createViewerForElement(container)
}

const document_ = orca.document
if (!document_) {
  throw new Error('this file runs as a custom editor')
}
const session = await document_.session()
render(session.value)
session.onReplace(render)
