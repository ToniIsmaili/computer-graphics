import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const aspect = window.innerWidth / window.innerHeight;
const perspective = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
perspective.position.set(2, 2, 10);
perspective.lookAt(0, 0, 0);

const size = 8;
const orthographic = new THREE.OrthographicCamera(
  -size * aspect,
  size * aspect,
  size,
  -size,
  0.1,
  100
);
orthographic.position.set(0, 0, 10);
orthographic.lookAt(0, 0, 0);

const cameras = [perspective, orthographic];
let current = 0;
console.log('Active camera:', cameras[current]);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
const directional = new THREE.DirectionalLight(0xffffff, 3.5);
directional.position.set(5, 8, 4);
scene.add(ambient, directional);

const depths = [0, -4, -8];
const colors = [0xcc0000, 0x002222, 0xff44ff];

new PLYLoader().load('models/3dModel.ply', (geo) => {
  geo.center();
  for (let i = 0; i < depths.length; i++) {
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({color: colors[i], roughness: 0.4})
    );
    mesh.scale.setScalar(0.02);
    mesh.rotation.x = Math.PI;
    mesh.position.x = (i - 1) * 2;
    mesh.position.z = depths[i];
    scene.add(mesh);
  }

});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    current = (current + 1) % cameras.length;
    console.log('Active camera:', cameras[current]);
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, cameras[current]);
}
animate();