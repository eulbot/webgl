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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(1);

//import * as WebGLDebugUtils from 'webgl-debug'
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.loadShader().then(function (shaders) {
            var program = _this.setupProgram(shaders.vertex, shaders.fragment);
            _this.drawRect(program);
        });
    }
    Main.prototype.drawRect = function (program) {
        var gl = this.gl;
        var triangleVertices = [
            0.0, .5, 1.0, 1.0, 0.0,
            -.5, -.5, 0.7, 0.0, 1.0,
            .5, -.5, 0.1, 1.0, 0.6
        ];
        var triangleVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(positionAttribLocation);
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(colorAttribLocation);
        gl.useProgram(program);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    Main.prototype.loadShader = function () {
        return Promise.all([__WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].file('shader/vertex.glsl'), __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].file('shader/fragment.glsl')]).then(function (result) {
            return {
                vertex: result[0],
                fragment: result[1]
            };
        });
    };
    Main.prototype.setupProgram = function (vertexShaderText, fragmentShaderText) {
        this.canvas = document.getElementById('surface');
        this.gl = this.canvas.getContext('webgl');
        var gl = this.gl || this.canvas.getContext('experimental-webgl');
        gl.clearColor(.75, .85, .8, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vertexShader, vertexShaderText);
        gl.shaderSource(fragmentShader, fragmentShaderText);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertexShader));
            return;
        }
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling fragment shader', gl.getShaderInfoLog(fragmentShader));
            return;
        }
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR linking program', gl.getProgramInfoLog(program));
            return;
        }
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program', gl.getProgramInfoLog(program));
            return;
        }
        return program;
    };
    return Main;
}());
new Main();


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.file = function (url) {
        return new Promise(function (rs, rj) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    rs(xhr.responseText);
                }
            };
            xhr.send();
        });
    };
    return Util;
}());
/* harmony default export */ __webpack_exports__["a"] = (Util);


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map