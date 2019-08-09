figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = msg => {
  if (msg.type === 'create-grid') {
    // const nodes = []
    const dimensions = msg.dimensions;

    for (const node of figma.currentPage.selection) {
        console.log(node);
      }

    // figma.currentPage.selection = nodes
    // figma.viewport.scrollAndZoomIntoView(nodes)
  }

//   figma.closePlugin()
}