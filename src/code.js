figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = msg => {
  if (msg.type === 'create-grid') {
    const options = msg.options;
    let x = 0;
    let y = 0;
    const totalGridLength = options.rows * options.cols;
    // Get selection on current page
    const { selection } = figma.currentPage;

    if (!(selection.length > 0)) {
      console.log('no selection');
      return;
    }

    // Creating copy of selected items
    const copies = [];
    selection.forEach(node => {
      copies.push(node.clone())
    });

    if (options.repeat) {
      while (copies.length  < totalGridLength) {
        for(let i = 0; i < figma.currentPage.selection.length; i++) {
          if (copies.length < totalGridLength) {
            copies.push(figma.currentPage.selection[i].clone());
          }
        }
      }
    }

    if (options.randomize) {
      shuffleArray(copies);
    }

    // Creating new group out of copies array
    const group = figma.group(copies, figma.currentPage.selection[0].parent)
    group.name = 'Grid';

    // removing the previous selection
    selection.forEach(node => {
      node.remove();
    });

    figma.currentPage.selection = [group];

    let selectionCounter = 0;
    let selectionLength = figma.currentPage.selection[0].children.length;

    for (let i = 0; i < options.rows; i++) {
      if (selectionCounter < selectionLength) {
        for(let j = 0; j < options.cols; j++) {
          if (selectionCounter < selectionLength) {
            figma.currentPage.selection[0].children[selectionCounter].x = x;
            figma.currentPage.selection[0].children[selectionCounter].y = y;
            x = x + figma.currentPage.selection[0].children[selectionCounter].width + options.padding
            selectionCounter++;
          }
        }
        x = 0;
        y = y + figma.currentPage.selection[0].children[i].height + options.padding
      }
    }

    figma.currentPage.selection = [group];
  }
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      var temp = array[i].clone();
      array[i] = array[j].clone();
      array[j] = temp;
  }
}
