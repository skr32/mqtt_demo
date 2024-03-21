import * as THREE from 'three';

import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

let camera, scene, renderer;
//const targetFrameRate = 1000 / 60; // 60 frames per second
const targetFrameRate = 1000 / 20; // 60 frames per second
let lastRenderTime = 0;

let lastRotation = {x: 0, y: 0, z: 0};
//const minDifference = 0.1;


init();
render();

function init() {

    const container = document.createElement('div');
    document.body.appendChild(container);


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 100, 0);

    const environment = new RoomEnvironment(renderer);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbbbbbb);
    scene.environment = pmremGenerator.fromScene(environment).texture;
    environment.dispose();

    const ktx2Loader = new KTX2Loader()
        .setTranscoderPath('jsm/libs/basis/')
        .detectSupport(renderer);

    const loader = new GLTFLoader().setPath('models/gltf/rpi3/');
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load('raspberry_pi_3.glb', function (gltf) {

        // coffeemat.glb was produced from the source scene using gltfpack:
        // gltfpack -i coffeemat/scene.gltf -o coffeemat.glb -cc -tc
        // The resulting model uses EXT_meshopt_compression (for geometry) and KHR_texture_basisu (for texture compression using ETC1S/BasisLZ)

        gltf.scene.position.y = 8;
        gltf.scene.scale.set(10, 10, 10);
        scene.rotation.set(90, 0, 20);

        scene.add(gltf.scene);

        render();

    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 400;
    controls.maxDistance = 1000;
    controls.target.set(10, 90, - 16);
    controls.update();

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function rotateCamera(x, y, z) {
    // Convert degrees to radians
    const rotationX = x * Math.PI / 180;
    const rotationY = y * Math.PI / 180;
    const rotationZ = z * Math.PI / 180;

    // Rotate the camera
    camera.rotation.set(rotationX, rotationY, rotationZ);

    // Render the scene after the rotation
    render();
}


export function rotateScene(x, y, z) {   
    
    // Convert degrees to radians
    const rotationX = -x * Math.PI / 180;
    const rotationY = y * Math.PI / 180;
    const rotationZ = z * Math.PI / 180;

    // Check if the rotation values have changed significantly
    const minDifference = 0.001; // Adjust as needed
    const hasChanged = Math.abs(lastRotation.x - rotationX) > minDifference ||
                       Math.abs(lastRotation.y - rotationY) > minDifference ||
                       Math.abs(lastRotation.z - rotationZ) > minDifference;


    if (hasChanged) {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.rotation.set(rotationX, rotationY, rotationZ);
            }
        });

        lastRotation = {x: rotationX, y: rotationY, z: rotationZ};
        render();
    }
                

    console.log(x* Math.PI / 180);
    render();
}

function render() {
    renderer.render(scene, camera);
}
