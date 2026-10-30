import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

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

const positions = new Float32Array([
  0, 1.5, 0,
  0, -1.5, 0,
  1, 0, 0,
  0, 0, 1,
  -1, 0, 0,
  0, 0, -1
]);

const indexes = [
  0, 3, 2,
  0, 4, 3,
  0, 5, 4,
  0, 2, 5,
  1, 2, 3,
  1, 3, 4,
  1, 4, 5,
  1, 5, 2
]

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setIndex(indexes);
geometry.computeVertexNormals();

const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshStandardMaterial({ color: 0x026e4c, roughness: 0.4 })
);
scene.add(mesh);

const nonIndexed = geometry.toNonIndexed();
nonIndexed.computeVertexNormals();

console.log('Vertices:', geometry.attributes.position.count, 'Faces:', indexes.length / 3);
console.log('Non-Indexed Vertices:', nonIndexed.attributes.position.count, 'Faces:', indexes.length / 3);

window.addEventListener('keydown', (event) => {
  if (event.key === 'f') {
    if (mesh.geometry === geometry) {
      mesh.geometry = nonIndexed;
    } else {
      mesh.geometry = geometry;
    }
  }
})

function animate() {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
  mesh.rotation.y += 0.007;
  // mesh.position.y = Math.sin(Date.now() * 0.002) * 0.2;
}
animate();