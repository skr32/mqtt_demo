//import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a GLTFLoader instance
const loader = new GLTFLoader();

// Load the glTF model
loader.load(
    // Path to the glTF file
    'rpi3/scene.gltf',
    // onLoad callback function
    function (gltf) {
        // Add the loaded model to the scene
        scene.add(gltf.scene);
    },
    // onProgress callback function (optional)
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // onError callback function (optional)
    function (error) {
        console.error('Error loading glTF model', error);
    }
);

//camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    // Rotate the loaded model
    scene.traverse((object) => {
        if (object.isMesh) object.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}
