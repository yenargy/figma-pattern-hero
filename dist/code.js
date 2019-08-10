/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/code.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/code.js":
/*!*********************!*\
  !*** ./src/code.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBLHdCQUF3QiwwQkFBMEI7O0FBRWxEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVMsWUFBWTs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsT0FBTztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOzs7QUFHQTtBQUNBOztBQUVBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvZGUuanNcIik7XG4iLCJmaWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDMwMCwgaGVpZ2h0OiA0MDAgfSk7XHJcblxyXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xyXG4gIGlmIChtc2cudHlwZSA9PT0gJ2NhbmNlbCcpIHtcclxuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgfVxyXG5cclxuICBpZiAobXNnLnR5cGUgPT09ICdjcmVhdGUtZ3JpZCcpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSBtc2cub3B0aW9ucztcclxuICAgIGNvbnN0IHRvdGFsR3JpZExlbmd0aCA9IG9wdGlvbnMucm93cyAqIG9wdGlvbnMuY29scztcclxuXHJcbiAgICAvLyBHZXQgc2VsZWN0aW9uIG9uIGN1cnJlbnQgcGFnZVxyXG4gICAgbGV0IHsgc2VsZWN0aW9uIH0gPSBmaWdtYS5jdXJyZW50UGFnZTtcclxuXHJcbiAgICBpZiAoIShzZWxlY3Rpb24ubGVuZ3RoID4gMCkpIHtcclxuICAgICAgY29uc29sZS5sb2coJ25vIHNlbGVjdGlvbicpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0dGluZyB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IHNlbGVjdGVkIG5vZGVcclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCB5ID0gMDtcclxuXHJcbiAgICBsZXQgcGFyZW50Tm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXS5wYXJlbnQ7XHJcblxyXG5cclxuICAgIC8vIENyZWF0aW5nIGNvcHkgb2Ygc2VsZWN0ZWQgaXRlbXMgZm9yIHJlcGVhdGluZyBhbmQgc2h1ZmZsaW5nXHJcbiAgICBsZXQgY29waWVzID0gW107XHJcbiAgICBzZWxlY3Rpb24uZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgY29waWVzLnB1c2gobm9kZS5jbG9uZSgpKVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIERvIHRoZSByZXBlYXQgaWYgdGhlIG9wdGlvbnMgaXMgZW5hYmxlZFxyXG4gICAgaWYgKG9wdGlvbnMucmVwZWF0KSB7XHJcbiAgICAgIC8vY2FjaGluZyB0aGUgbGVuZ3RoIGZvciBwZXJmb3JtYW5jZVxyXG4gICAgICBjb25zdCBsID0gc2VsZWN0aW9uLmxlbmd0aDtcclxuICAgICAgd2hpbGUgKGNvcGllcy5sZW5ndGggIDwgdG90YWxHcmlkTGVuZ3RoKSB7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGNvcGllcy5sZW5ndGggPCB0b3RhbEdyaWRMZW5ndGgpIHtcclxuICAgICAgICAgICAgY29waWVzLnB1c2goc2VsZWN0aW9uW2ldLmNsb25lKCkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBEbyB0aGUgc2h1ZmZsaW5nIGlmIHRoZSBvcHRpb25zIGlzIGVuYWJsZWRcclxuICAgIGxldCBzaHVmZmxlZENvcGllcyA9IFtdXHJcbiAgICBpZiAob3B0aW9ucy5yYW5kb21pemUpIHtcclxuICAgICAgc2h1ZmZsZWRDb3BpZXMgPSBzaHVmZmxlQXJyYXkoY29waWVzKTtcclxuICAgICAgc2h1ZmZsZWRDb3BpZXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gcmVtb3ZpbmcgdGhlIHByZXZpb3VzIHNlbGVjdGlvblxyXG4gICAgc2VsZWN0aW9uLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgIG5vZGUucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzZWxlY3Rpb24gPSBvcHRpb25zLnJhbmRvbWl6ZSA/IHNodWZmbGVkQ29waWVzIDogY29waWVzO1xyXG5cclxuICAgIFxyXG4gICAgbGV0IHNlbGVjdGlvbkNvdW50ZXIgPSAwO1xyXG4gICAgbGV0IHNlbGVjdGlvbkxlbmd0aCA9IHNlbGVjdGlvbi5sZW5ndGg7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLnJvd3M7IGkrKykge1xyXG4gICAgICBpZiAoc2VsZWN0aW9uQ291bnRlciA8IHNlbGVjdGlvbkxlbmd0aCkge1xyXG4gICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBvcHRpb25zLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgaWYgKHNlbGVjdGlvbkNvdW50ZXIgPCBzZWxlY3Rpb25MZW5ndGgpIHtcclxuICAgICAgICAgICAgc2VsZWN0aW9uW3NlbGVjdGlvbkNvdW50ZXJdLnggPSB4O1xyXG4gICAgICAgICAgICBzZWxlY3Rpb25bc2VsZWN0aW9uQ291bnRlcl0ueSA9IHk7XHJcbiAgICAgICAgICAgIHggPSB4ICsgc2VsZWN0aW9uW3NlbGVjdGlvbkNvdW50ZXJdLndpZHRoICsgb3B0aW9ucy5wYWRkaW5nXHJcbiAgICAgICAgICAgIHNlbGVjdGlvbkNvdW50ZXIrKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgeCA9IDA7XHJcbiAgICAgICAgeSA9IHkgKyBzZWxlY3Rpb25baV0uaGVpZ2h0ICsgb3B0aW9ucy5wYWRkaW5nXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL0NyZWF0aW5nIGEgZ3JvdXAgd2l0aCB0aGUgc2VsZWN0aW9uXHJcbiAgICBjb25zdCBncm91cCA9IGZpZ21hLmdyb3VwKHNlbGVjdGlvbiwgc2VsZWN0aW9uWzBdLnBhcmVudCk7XHJcbiAgICBncm91cC5uYW1lID0gJ0dyaWQnO1xyXG5cclxuICAgIC8vQXBwZW5kaW5nIGl0IHRvIHRoZSBwYXJlbnQgb2Ygc2VsZWN0aW9uXHJcbiAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKGdyb3VwKTtcclxuICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IFtncm91cF07XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBzaHVmZmxlQXJyYXkgPSAoYXJyYXkpID0+IHtcclxuICAvLyBVc2luZyBKYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIER1cnN0ZW5mZWxkIHNodWZmbGVcclxuICBsZXQgbmV3QXJyYXkgPSBBcnJheS5mcm9tKGFycmF5KTtcclxuICBmb3IgKGxldCBpID0gbmV3QXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgIGxldCB0ZW1wID0gbmV3QXJyYXlbaV07XHJcbiAgICAgIG5ld0FycmF5W2ldID0gbmV3QXJyYXlbal07XHJcbiAgICAgIG5ld0FycmF5W2pdID0gdGVtcDtcclxuICB9XHJcbiAgcmV0dXJuIG5ld0FycmF5O1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=