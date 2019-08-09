figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = msg => {
  if (msg.type === 'create-grid') {
    const dimensions = msg.dimensions;
    let x = 0;
    let y = 0;
    let selectionCounter = 0;
    let selectionLength = figma.currentPage.selection.length;
    let nodes = [];

    for (let i = 0; (i < dimensions.rows); i++) {
      if (selectionCounter < selectionLength) {
        for(let j = 0; j < dimensions.cols; j++) {
          if (selectionCounter < selectionLength) {
            figma.currentPage.selection[selectionCounter].x = x;
            figma.currentPage.selection[selectionCounter].y = y;
            // console.log("---------------");
            // console.log(j + " - x-axis: " + x + ", y-axis: " + y );
            x = x + figma.currentPage.selection[selectionCounter].width + dimensions.padding
            selectionCounter++;
            nodes.push(figma.currentPage.selection[i]);
          }
        }
        x = 0;
        y = y + figma.currentPage.selection[i].height + dimensions.padding
      }
    }

    // Creating a group
    // const groupedNodes = figma.group(nodes, figma.currentPage)

    // figma.currentPage.selection = nodes
    // figma.viewport.scrollAndZoomIntoView(nodes)
  }
}