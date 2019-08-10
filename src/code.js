figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = msg => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }

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

    // Creating copy of selected items for repeating and shuffling
    let copies = [];

    selection.forEach(node => {
      copies.push(node.clone())
    });

    if (options.repeat) {
      const l = figma.currentPage.selection.length;
      while (copies.length  < totalGridLength) {
        for(let i = 0; i < l; i++) {
          if (copies.length < totalGridLength) {
            copies.push(figma.currentPage.selection[i].clone());
          }
        }
      }
    }
    
    let shuffledCopies = []

    if (options.randomize) {
      shuffledCopies = shuffleArray(copies);
      shuffledCopies.forEach(item => {
        figma.currentPage.appendChild(item);
      })
    }

    const group = figma.group(options.repeat ? copies : shuffledCopies, figma.currentPage.selection[0].parent)
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
  // Using Javascript implementation of Durstenfeld shuffle
  let newArray = Array.from(array);
  for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      let temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
  }
  return newArray;
}
