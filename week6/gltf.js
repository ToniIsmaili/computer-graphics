import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(3, 2, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 8, 4);
scene.add(ambientLight, directionalLight);

const control = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();
loader.load('model.glb', (gltf) => {
    gltf.scene.rotation.y = Math.PI;
    let meshes = 0;
    let vertices = 0;
    let faces = 0;

    gltf.scene.traverse((obj) => {
        if (!obj.isMesh) {
            return;
        };
        meshes++;
        vertices += obj.geometry.attributes.position.count;
        faces += (obj.geometry.index?.count ?? obj.geometry.attributes.position.count) / 3;
    });

    console.log(`Meshes: ${meshes}, Vertices: ${vertices}, Faces: ${faces}`); // total meshes, number of vertices and faces
    scene.add(gltf.scene);
})

function animate() {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
}
animate();