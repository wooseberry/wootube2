/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/node-fetch/browser.js":
/*!********************************************!*\
  !*** ./node_modules/node-fetch/browser.js ***!
  \********************************************/
/***/ ((module, exports) => {

eval(" // ref: https://github.com/tc39/proposal-global\n\nvar getGlobal = function getGlobal() {\n  // the only reliable means to get the global object is\n  // `Function('return this')()`\n  // However, this causes CSP violations in Chrome apps.\n  if (typeof self !== 'undefined') {\n    return self;\n  }\n\n  if (typeof window !== 'undefined') {\n    return window;\n  }\n\n  if (typeof global !== 'undefined') {\n    return global;\n  }\n\n  throw new Error('unable to locate global object');\n};\n\nvar global = getGlobal();\nmodule.exports = exports = global.fetch; // Needed for TypeScript and Webpack.\n\nif (global.fetch) {\n  exports.default = global.fetch.bind(global);\n}\n\nexports.Headers = global.Headers;\nexports.Request = global.Request;\nexports.Response = global.Response;\n\n//# sourceURL=webpack://wootube2/./node_modules/node-fetch/browser.js?");

/***/ }),

/***/ "./src/client/js/videoPlayer.js":
/*!**************************************!*\
  !*** ./src/client/js/videoPlayer.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-fetch */ \"./node_modules/node-fetch/browser.js\");\n/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fetch__WEBPACK_IMPORTED_MODULE_0__);\n\nvar video = document.querySelector(\"video\");\nvar playBtn = document.getElementById(\"play\");\nvar playBtnIcon = playBtn.querySelector(\"i\");\nvar muteBtn = document.getElementById(\"mute\");\nvar muteBtnIcon = muteBtn.querySelector(\"i\");\nvar volumeRange = document.getElementById(\"volume\");\nvar currentTime = document.getElementById(\"currentTime\");\nvar totalTime = document.getElementById(\"totalTime\");\nvar timeline = document.getElementById(\"timeline\");\nvar fullScreenBtn = document.getElementById(\"fullScreen\");\nvar fullScreenIcon = fullScreenBtn.querySelector(\"i\");\nvar videoContainer = document.getElementById(\"videoContainer\");\nvar videoControls = document.getElementById(\"videoControls\");\nvar controlsTimeout = null;\nvar controlsMovementTimeout = null;\nvar volumeValue = 0.5;\nvideo.volume = volumeValue;\n\nvar handlePlayClick = function handlePlayClick(e) {\n  //if the video is playing,  pause it\n  //Btn을 눌렀는데 비디오가 멈춰저 있으면 \n  if (video.paused) {\n    video.play();\n    console.log(video);\n  } else {\n    // Btn 눌렀을때 비디오가 재생중이면 pause 실행\n    video.pause();\n  } //else play the video\n\n\n  playBtnIcon.classList = video.paused ? \"fas fa-play\" : \"fas fa-pause\";\n}; //handlePause, handlePlay = text 변화를 위한 것인가\n\n\nvar handlePause = function handlePause() {\n  return playBtn.innerText = \"Play\";\n};\n\nvar handlePlay = function handlePlay() {\n  return playBtn.innerText = \"Pause\";\n};\n\nvar handleMuteClick = function handleMuteClick(e) {\n  if (video.muted) {\n    video.muted = false;\n  } else {\n    video.muted = true;\n  }\n\n  muteBtnIcon.classList = video.muted ? \"fas fa-volume-mute\" : \"fas fa-volume-up\";\n  volumeRange.value = video.muted ? 0 : volumeValue;\n};\n\nvar handleVolumeChange = function handleVolumeChange(event) {\n  //range 값을 가져와서\n  var value = event.target.value;\n\n  if (video.muted) {\n    video.muted = false;\n    muteBtn.innerText = \"Mute\";\n  } //video 실제 volume에 적용\n\n\n  volumeValue = value;\n  video.volume = value;\n}; //일종의 트릭인데 이해안감\n\n\nvar formatTime = function formatTime(seconds) {\n  return new Date(seconds * 1000).toISOString().substr(14, 5);\n};\n\nvar handleLoadedMetadata = function handleLoadedMetadata() {\n  //영상의 전체시간을 formatTime의 인자로 넣어서 35초영상이면 35*1000으로 표현\n  totalTime.innerText = formatTime(Math.floor(video.duration));\n  timeline.max = Math.floor(video.duration);\n};\n\nvar handleTimeUpdate = function handleTimeUpdate() {\n  currentTime.innerText = formatTime(Math.floor(video.currentTime)); //timeline의 현재 값이 range bar에 반영\n\n  timeline.value = Math.floor(video.currentTime);\n}; //range값을 실제 video timeline 값으로\n\n\nvar handleTimelineChange = function handleTimelineChange(event) {\n  var value = event.target.value;\n  video.currentTime = value;\n};\n\nvar handleFullScreen = function handleFullScreen() {\n  var fullscreen = document.fullscreenElement;\n\n  if (fullscreen) {\n    document.exitFullscreen();\n    fullScreenIcon.classList = \"fas  fa-expand\";\n  } else {\n    videoContainer.requestFullscreen();\n    fullScreenIcon.classList = \"fas fa-compress\";\n  }\n}; //내가 움직일 때마다 오래된 timeout을 취소하고 새로운 timeout 만듦\n\n\nvar hideControls = function hideControls() {\n  return videoControls.classList.remove(\"showing\");\n};\n\nvar handleMouseMove = function handleMouseMove() {\n  if (controlsTimeout) {\n    clearTimeout(controlsTimeout);\n    controlsTimeout = null;\n  }\n\n  if (controlsMovementTimeout) {\n    clearTimeout(controlsMovementTimeout);\n    controlsMovementTimeout = null;\n  }\n\n  videoControls.classList.add(\"showing\");\n  controlsMovementTimeout = setTimeout(hideControls, 3000);\n};\n\nvar handleMouseLeave = function handleMouseLeave() {\n  controlsTimeout = setTimeout(hideControls, 3000);\n};\n\nvar handleEnded = function handleEnded() {\n  var id = videoContainer.dataset.id;\n  node_fetch__WEBPACK_IMPORTED_MODULE_0___default()(\"/api/videos/\".concat(id, \"/view\"), {\n    method: \"POST\"\n  });\n};\n\nplayBtn.addEventListener(\"click\", handlePlayClick);\nmuteBtn.addEventListener(\"click\", handleMuteClick);\nvolumeRange.addEventListener(\"input\", handleVolumeChange);\nvideo.addEventListener(\"loadedmetadata\", handleLoadedMetadata);\nvideo.addEventListener(\"timeupdate\", handleTimeUpdate);\nvideo.addEventListener(\"ended\", handleEnded);\nvideoContainer.addEventListener(\"mousemove\", handleMouseMove);\nvideoContainer.addEventListener(\"mouseleave\", handleMouseLeave);\ntimeline.addEventListener(\"input\", handleTimelineChange);\nfullScreenBtn.addEventListener(\"click\", handleFullScreen);\n/*\nloadedmetadata\n미디어의 메타 데이터가 로드 되었을 때를 나타냄\n메타 데이터는 우리가 유용하게 사용할 수 있는 동영상의 재생시간과 같은 것을 의미한다.\n미디어가 로드되기 전에, 먼저 메타 데이터를 뽑아와서 활용할 수 있다.\n\nloaddata\n미디어의 메타 데이터가 로드 되었을 때를 나타낸다\n여기서 프레임은 미디어의 대한 전체 프레임이 아닌 첫프레임 또는 현재 프레임을 뜻 할 수있다.\n즉,조금이라도 다운로드가 되었을 때이고, 이러한 의미는 재생할 수 있다는 것을 알아차릴 수 있다.\n하지만 주의해야 할 것은 로드된 데이터가 재생에 있어서, 충분하다고 보장하지 않는다.\n즉,loadeddata 이벤트가 발생한 시점에서 play()메소드를 호출하면, 재생이 실패할 수도 있다.\n메타 데이터를 우선 가져오기에, loadedmetadata 이벤트가 발생한 후에, loadeddata 이벤트가 발생한다고 볼 수 있다.\n즉, loadeddata 에서도 메타 데이터를 활용할 수 있다는 것이다.\n\ncanplay\n재생을 할 수 있는 정도의 충분한 데이터가 로드되었을 때, 미디어는 재생할 수 있다고 판단하고 이벤트를 호출한다.\n즉, canplay 이벤트는 미디어에 대한 재생을 할 수 있다는 것을 나타낸다.\nloadeddata 에서는 재생을 보장하지 못했지만, 여기서는 재생을 보장한다.\n하지만 재생을 보장하지만, 버퍼로 인해 중단될 수 있다.\n즉, 재생을 보장한다는 것은, 전체 재생이 아닌 현재 시점에서 재생을 할 수 있는지 없는지를 나타낸다.\n그리고 다른 면에서 조금 더 생각해보면, canplay 이벤트는 loadeddata 이벤트가 일어난 후에 호출된다.\n\ncanplaythrough\ncanplay 이벤트와 동일하지만, 차이점은 전체 미디어가 중단없이 재생할 수 있을 때 호출된다.\ncanplay 이벤트가 전체 재생을 보장하지는 못하였다면, canplaythrough 는 중단없이 전체 재생을 보장하는 목적이다.\n현재 로드 속도를 유지한다고 가정하고, 중단이 되지 않는다고 판단하면 호출된다.\n하지만 이것 또한 가정이기때문에, canplay 이벤트보다는 전체 재생을 보장하겠지만, 확신할 수는 없다.\n그리고 다른 면에서 조금 더 생각해보면, canplaythrough 이벤트는 canplay 이벤트가 일어난 후에 호출된다.\n\n결과적으로 순서는 loadedmetadata -> loadeddata -> canplay -> canplaythrough 를 의미할 수 있다.\n*/\n\n//# sourceURL=webpack://wootube2/./src/client/js/videoPlayer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/client/js/videoPlayer.js");
/******/ 	
/******/ })()
;