import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Variables to track double-tap
let lastTapTime = 0;
function onDocumentMouseDown(event) {
    sound.play();
    if (action) {
        action.reset(); // Reset to the beginning
        action.time = 1.0;   // Start from 1 second (adjust as needed)
        action.play();  // Play the animation
    }

    const currentTime = Date.now();
    const tapGap = currentTime - lastTapTime;
    // Check if the time between taps is within the double-tap threshold
    if (tapGap < 300 && tapGap > 0) {
        event.preventDefault(); // Prevent zoom on double-tap
    }
    lastTapTime = currentTime;

}

function onDocumentMouseUp(event) {
    sound.stop();
    if (action) {
        action.stop();  // Stop the animation
    }
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
renderer.domElement.addEventListener('touchstart', onDocumentMouseDown, false);
renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
renderer.domElement.addEventListener('touchend', onDocumentMouseUp, false);

// Add AudioListener to the camera
const listener = new THREE.AudioListener();
camera.add(listener);
// Create a global audio source
const sound = new THREE.Audio(listener);
// Load an audio file and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();

audioLoader.load('../../assets/ooiiao1.ogg', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1.0);

});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
camera.position.z = 1;

const loader = new GLTFLoader();
let mixer;
let action;
loader.load('../../assets/scene.gltf', function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
        action = mixer.clipAction(clip);
    });
    renderer.setAnimationLoop(animate);
}, undefined, function (error) {
    console.error(error);
});

const light = new THREE.AmbientLight(0xffffff, 10); // soft white light
scene.add(light);


function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    if (mixer) mixer.update(0.01);

    if (!sound.isPlaying) {
        action.stop();
    }
    renderer.render(scene, camera);
}