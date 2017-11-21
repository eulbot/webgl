declare var require: any;
import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE)

class Main {


    constructor() {

        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        let renderer = new THREE.WebGLRenderer({antialias: true});
        let controls = new OrbitControls( camera, renderer.domElement );

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        camera.position.z = 5;

        var animate = function () {
            requestAnimationFrame( animate );

            cube.rotation.y += 0.003;

            renderer.render(scene, camera);
        };

        animate();
    }
}

new Main();