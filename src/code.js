figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = msg => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }

  if (msg.type === 'create-grid') {
    const options = msg.options;
    const totalGridLength = options.rows * options.cols;

    // Get selection on current page
    let { selection } = figma.currentPage;

    if (!(selection.length > 0)) {
      console.log('no selection');
      return;
    }

    // Getting the position of the first selected node
    let x = 0;
    let y = 0;

    let parentNode = figma.currentPage.selection[0].parent;


    // Creating copy of selected items for repeating and shuffling
    let copies = [];
    selection.forEach(node => {
      copies.push(node.clone())
    });


    // Do the repeat if the options is enabled
    if (options.repeat) {
      //caching the length for performance
      const l = selection.length;
      while (copies.length  < totalGridLength) {
        for(let i = 0; i < l; i++) {
          if (copies.length < totalGridLength) {
            copies.push(selection[i].clone());
          }
        }
      }
    }
    
    // Do the shuffling if the options is enabled
    let shuffledCopies = []
    if (options.randomize) {
      shuffledCopies = shuffleArray(copies);
      shuffledCopies.forEach(item => {
        figma.currentPage.appendChild(item);
      })
    }


    // removing the previous selection
    selection.forEach(node => {
      node.remove();
    });

    selection = options.randomize ? shuffledCopies : copies;

    
    let selectionCounter = 0;
    let selectionLength = selection.length;

    for (let i = 0; i < options.rows; i++) {
      if (selectionCounter < selectionLength) {
        for(let j = 0; j < options.cols; j++) {
          if (selectionCounter < selectionLength) {
            selection[selectionCounter].x = x;
            selection[selectionCounter].y = y;
            x = x + selection[selectionCounter].width + options.padding
            selectionCounter++;
          }
        }
        x = 0;
        y = y + selection[i].height + options.padding
      }
    }

    //Creating a group with the selection
    const group = figma.group(selection, selection[0].parent);
    group.name = 'Grid';

    //Appending it to the parent of selection
    parentNode.appendChild(group);
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
