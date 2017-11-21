import Util from './util'
import * as glm from 'gl-matrix'

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

        var boxVertices = 
        [ // X, Y, Z           R, G, B
            // Top
            -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
            -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
            1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
            1.0, 1.0, -1.0,    0.5, 0.5, 0.5,
    
            // Left
            -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
            -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
            -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
            -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,
    
            // Right
            1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
            1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
            1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
            1.0, 1.0, -1.0,   0.25, 0.25, 0.75,
    
            // Front
            1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
            1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
    
            // Back
            1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
            1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
    
            // Bottom
            -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
            -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
            1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
            1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
        ];
    
        var boxIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,
    
            // Left
            5, 4, 6,
            6, 4, 7,
    
            // Right
            8, 9, 10,
            8, 10, 11,
    
            // Front
            13, 12, 14,
            15, 14, 12,
    
            // Back
            16, 17, 18,
            16, 18, 19,
    
            // Bottom
            21, 20, 22,
            22, 20, 23
        ];

        let boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
        
        let boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

        let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(positionAttribLocation);
        
        let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(colorAttribLocation);

        gl.useProgram(program);

        let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
        let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

        let worldMatrix = new Float32Array(16);
        let viewMatrix = new Float32Array(16);
        let projMatrix = new Float32Array(16);

        glm.mat4.identity(worldMatrix);
        glm.mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
        glm.mat4.perspective(projMatrix, glm.glMatrix.toRadian(30), this.canvas.width / this.canvas.height, 0.1, 1000.0);

        gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

        var identityMatrix = new Float32Array(16);
        glm.mat4.identity(identityMatrix);
        var angle = 0;

        let xRot = new Float32Array(16);
        let yRot = new Float32Array(16);

        let loop = () => {
            angle = performance.now() / 1000 / 6 * 1 * Math.PI;

            glm.mat4.rotate(xRot, identityMatrix, angle / 4, [1, 0, 0]);
            glm.mat4.rotate(yRot, identityMatrix, angle / 2, [0, 1, 0]);
            glm.mat4.mul(worldMatrix, xRot, yRot);
            gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

            gl.clearColor(.75, .85, .8, 1);
            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
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
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);

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