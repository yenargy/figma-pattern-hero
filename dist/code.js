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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBLHdCQUF3QiwwQkFBMEI7O0FBRWxEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxZQUFZOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLHNCQUFzQix3Q0FBd0M7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDLE9BQU87QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb2RlLmpzXCIpO1xuIiwiZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMDAsIGhlaWdodDogNDAwIH0pO1xuXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICBpZiAobXNnLnR5cGUgPT09ICdjcmVhdGUtZ3JpZCcpIHtcbiAgICBjb25zdCBvcHRpb25zID0gbXNnLm9wdGlvbnM7XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gMDtcbiAgICBjb25zdCB0b3RhbEdyaWRMZW5ndGggPSBvcHRpb25zLnJvd3MgKiBvcHRpb25zLmNvbHM7XG4gICAgLy8gR2V0IHNlbGVjdGlvbiBvbiBjdXJyZW50IHBhZ2VcbiAgICBjb25zdCB7IHNlbGVjdGlvbiB9ID0gZmlnbWEuY3VycmVudFBhZ2U7XG5cbiAgICBpZiAoIShzZWxlY3Rpb24ubGVuZ3RoID4gMCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdubyBzZWxlY3Rpb24nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGluZyBjb3B5IG9mIHNlbGVjdGVkIGl0ZW1zXG4gICAgY29uc3QgY29waWVzID0gW107XG4gICAgc2VsZWN0aW9uLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICBjb3BpZXMucHVzaChub2RlLmNsb25lKCkpXG4gICAgfSk7XG5cbiAgICBpZiAob3B0aW9ucy5yZXBlYXQpIHtcbiAgICAgIHdoaWxlIChjb3BpZXMubGVuZ3RoICA8IHRvdGFsR3JpZExlbmd0aCkge1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNvcGllcy5sZW5ndGggPCB0b3RhbEdyaWRMZW5ndGgpIHtcbiAgICAgICAgICAgIGNvcGllcy5wdXNoKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbltpXS5jbG9uZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5yYW5kb21pemUpIHtcbiAgICAgIHNodWZmbGVBcnJheShjb3BpZXMpO1xuICAgIH1cblxuICAgIC8vIENyZWF0aW5nIG5ldyBncm91cCBvdXQgb2YgY29waWVzIGFycmF5XG4gICAgY29uc3QgZ3JvdXAgPSBmaWdtYS5ncm91cChjb3BpZXMsIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXS5wYXJlbnQpXG4gICAgZ3JvdXAubmFtZSA9ICdHcmlkJztcblxuICAgIC8vIHJlbW92aW5nIHRoZSBwcmV2aW91cyBzZWxlY3Rpb25cbiAgICBzZWxlY3Rpb24uZm9yRWFjaChub2RlID0+IHtcbiAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgfSk7XG5cbiAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbZ3JvdXBdO1xuXG4gICAgbGV0IHNlbGVjdGlvbkNvdW50ZXIgPSAwO1xuICAgIGxldCBzZWxlY3Rpb25MZW5ndGggPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0uY2hpbGRyZW4ubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLnJvd3M7IGkrKykge1xuICAgICAgaWYgKHNlbGVjdGlvbkNvdW50ZXIgPCBzZWxlY3Rpb25MZW5ndGgpIHtcbiAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IG9wdGlvbnMuY29sczsgaisrKSB7XG4gICAgICAgICAgaWYgKHNlbGVjdGlvbkNvdW50ZXIgPCBzZWxlY3Rpb25MZW5ndGgpIHtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXS5jaGlsZHJlbltzZWxlY3Rpb25Db3VudGVyXS54ID0geDtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXS5jaGlsZHJlbltzZWxlY3Rpb25Db3VudGVyXS55ID0geTtcbiAgICAgICAgICAgIHggPSB4ICsgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdLmNoaWxkcmVuW3NlbGVjdGlvbkNvdW50ZXJdLndpZHRoICsgb3B0aW9ucy5wYWRkaW5nXG4gICAgICAgICAgICBzZWxlY3Rpb25Db3VudGVyKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHggPSAwO1xuICAgICAgICB5ID0geSArIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXS5jaGlsZHJlbltpXS5oZWlnaHQgKyBvcHRpb25zLnBhZGRpbmdcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbZ3JvdXBdO1xuICB9XG59XG5cbmNvbnN0IHNodWZmbGVBcnJheSA9IChhcnJheSkgPT4ge1xuICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgdmFyIHRlbXAgPSBhcnJheVtpXS5jbG9uZSgpO1xuICAgICAgYXJyYXlbaV0gPSBhcnJheVtqXS5jbG9uZSgpO1xuICAgICAgYXJyYXlbal0gPSB0ZW1wO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9