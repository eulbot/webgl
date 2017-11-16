import Util from './util'

class Main {

    canvas: HTMLCanvasElement;

    constructor() {
        this.init();
    }

    async init() {
        this.canvas = <HTMLCanvasElement>document.getElementById('surface');
        let gl = this.canvas.getContext('webgl');
        gl = gl || this.canvas.getContext('experimental-webgl');

        gl.clearColor(.75, .85, .8, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        
        gl.shaderSource(vertexShader, await Util.file('shader/vertex.glsl'));
        gl.shaderSource(fragmentShader, await Util.file('shader/fragment.glsl'));

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
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR linking program', gl.getProgramInfoLog(program));
            return;
        }
        if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program', gl.getProgramInfoLog(program));
        }
    }
}

new Main();