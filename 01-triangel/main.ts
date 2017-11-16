import Util from './util'
//import * as WebGLDebugUtils from 'webgl-debug'

class Main {

    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;

    constructor() {

        this.loadShader().then((shaders) => {
            let program = this.setupProgram(shaders.vertex, shaders.fragment);
            this.drawRect(program);
        });
        
    }

    drawRect(program: WebGLProgram) {

        let gl = this.gl;

        let triangleVertices = [
            0.0, .5,    1.0, 1.0, 0.0,
            -.5, -.5,   0.7, 0.0, 1.0,
            .5, -.5,    0.1, 1.0, 0.6
        ];

        let triangleVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
        
        let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(positionAttribLocation);
        
        let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(colorAttribLocation);

        gl.useProgram(program);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    
    loadShader(): Promise<{ vertex: string, fragment: string }> {

        return Promise.all([Util.file('shader/vertex.glsl'), Util.file('shader/fragment.glsl')]).then((result) => {
            return {
                vertex: result[0],
                fragment: result[1]
            }
        });
    }

    setupProgram(vertexShaderText, fragmentShaderText) {

        this.canvas = <HTMLCanvasElement>document.getElementById('surface');
        this.gl = this.canvas.getContext('webgl');
        let gl = this.gl || this.canvas.getContext('experimental-webgl');

        gl.clearColor(.75, .85, .8, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, vertexShaderText);
        gl.shaderSource(fragmentShader, fragmentShaderText);

        gl.compileShader(vertexShader);
        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertexShader));
            return;
        }
        
        gl.compileShader(fragmentShader);
        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling fragment shader', gl.getShaderInfoLog(fragmentShader));
            return;
        }

        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.validateProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR linking program', gl.getProgramInfoLog(program));
            return;
        }

        if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program', gl.getProgramInfoLog(program));
            return;
        }

        return program;
    }
}

new Main();