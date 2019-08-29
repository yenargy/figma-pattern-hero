figma.showUI(__html__, { width: 230, height: 390 });

const key = 'SETTINGS';

figma.ui.onmessage = msg => {
  if (msg.type === 'INIT_PLUGIN') {
    figma.clientStorage.getAsync(key).then(settings => {
      figma.ui.postMessage({ data: settings, type: 'SETTINGS' })
    });
  }

  if (msg.type === 'CREATE_GRID') {
    const options = msg.options;
    const totalGridLength = options.rows * options.cols;

    // Get selection on current page
    let { selection } = figma.currentPage;

    if (!(selection.length > 0)) {
      console.log('no selection');
      figma.notify('Please select atleast one node')
      figma.ui.postMessage({ data: {}, type: 'ERROR_EMPTY_SELECTION' })
      return;
    }

    console.log(options);

    // Getting the position of the first selected node
    let x = figma.currentPage.selection[0].x * 2;
    let y = figma.currentPage.selection[0].y;
    let initialPosition = x;

    let parentNode = figma.currentPage.selection[0].parent;


    // Creating copy of selected items for repeating and shuffling
    let copies = [];
    selection.forEach(node => {
      if (node.type === 'COMPONENT') {
        copies.push(node.createInstance())  
      } else {
        copies.push(node.clone())
      }
    });


    // Do the repeat if the options is enabled
    if (options.repeat) {
      //caching the length
      const l = selection.length;
      while (copies.length  < totalGridLength) {
        for(let i = 0; i < l; i++) {
          if (copies.length < totalGridLength) {
            if (selection[i].type === 'COMPONENT') {
              copies.push(selection[i].createInstance());
            } else {
              copies.push(selection[i].clone());
            }
          }
        }
      }
    }

    // Do the shuffling if the options is enabled
    let shuffledCopies = []
    if (options.shuffle) {
      shuffledCopies = shuffleArray(copies);
      shuffledCopies.forEach(item => {
        figma.currentPage.appendChild(item);
      })
    }


    // removing the previous selection
    selection.forEach(node => {
      // Not removing the original master component
      if (node.type === "COMPONENT") {
        return;
      }
      node.remove();
    });


    // Replacing the selection array with appropriate ones
    selection = options.shuffle ? shuffledCopies : copies;


    // Caching the length and counters
    let selectionCounter = 0;
    let selectionLength = selection.length;

    // Placing into a grid logic
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
        x = initialPosition;
        y = y + selection[i].height + options.padding
      }
    }


    const nodes = [];

    if (options.group) {
      //Creating a group with the selection
      const group = figma.group(selection, selection[0].parent);
      group.name = 'Pattern';

      //Appending it to the parent of selection
      parentNode.appendChild(group);
      figma.currentPage.selection = [group];
      nodes.push(group);
    } else {
      //Appending all the selection to the parent
      for (const node of selection) {
        parentNode.appendChild(node);
      }
      figma.currentPage.selection = selection;
      nodes.push(selection[0]);
    }

    //Saving user settings
    saveSettings(options);

    nodes.push(selection[0].parent);
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.ui.postMessage({ data: {}, type: 'DONE_LOADING' })
  }
}

const saveSettings = options => {
  figma.clientStorage.setAsync(key, options).then(() => {
  });
}

// Using Javascript implementation of Durstenfeld shuffle
const shuffleArray = (array) => {
  let newArray = Array.from(array);
  for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      let temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
  }
  return newArray;
}
