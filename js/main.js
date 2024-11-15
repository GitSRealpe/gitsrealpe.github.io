import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
camera.position.z = 1;

const loader = new GLTFLoader();
let mixer;
loader.load('assets/scene.gltf', function (gltf) {

    const model = gltf.scene;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);

    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });

}, undefined, function (error) {
    console.error(error);
});

const light = new THREE.AmbientLight(0xffffff, 10); // soft white light
scene.add(light);


function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    if (mixer) mixer.update(0.01);

    renderer.render(scene, camera);
}