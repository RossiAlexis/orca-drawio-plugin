// Runs before the draw.io viewer, which reads these globals once while it loads. Without them it
// fetches icons and shapes from viewer.diagrams.net, and Orca's plugin frames have no network.
;(function () {
  var base = new URL('drawio', document.baseURI).href
  window.DRAWIO_BASE_URL = base
  window.DRAWIO_SERVER_URL = base + '/'
  window.DRAWIO_VIEWER_URL = base + '/js/viewer-static.min.js'
  window.GRAPH_IMAGE_PATH = base + '/img'
  window.STENCIL_PATH = base + '/stencils'
  window.SHAPES_PATH = base + '/shapes'
  window.RESOURCES_PATH = base + '/resources'
  window.STYLE_PATH = base + '/styles'
  window.DRAW_MATH_URL = base + '/math4/es5'
  window.mxBasePath = base + '/mxgraph/'
  window.mxImageBasePath = base + '/mxgraph/images'
  window.DRAWIO_LIGHTBOX_URL = base
  window.PROXY_URL = base + '/proxy'
  window.EXPORT_URL = base + '/export'
})()
