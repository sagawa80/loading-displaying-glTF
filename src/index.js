import "@babel/polyfill"; //IE11
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const fov = 30;
const fovRad = (fov / 2) * (Math.PI / 180);

let dist;

let scene;
let camera;

let renderer;

let width = window.innerWidth;
let height = window.innerHeight;

const canvas = document.getElementById('webgl-canvas');

let mixer;
let clock = new THREE.Clock();

window.addEventListener("load", () => glInit());
window.addEventListener("resize", () => handleResize());

function glInit() {

  scene = new THREE.Scene();

  dist = (height / 2) / Math.tan(fovRad);

  camera = new THREE.PerspectiveCamera(fov, width / height, 1, dist * 2 );
  camera.position.set(0, height * 0.3, dist);

  const light = new THREE.HemisphereLight(0xFFFFFF, 0x0000FF, 3.0);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0xFFFFFF, 1.0);

  const gltfLoader = new GLTFLoader();
  const url = 'simple-bone.gltf';
  gltfLoader.load(url, (gltf) => {
    console.log(gltf);
    const obj = gltf.scene;
    obj.position.set(0, 50, 0);
    obj.scale.set(50,50,50);
    scene.add(obj);

    const animations = gltf.animations;
    if (animations && animations.length) {
      mixer = new THREE.AnimationMixer(obj);
      for (let i = 0; i < animations.length; i++) {
        let animation = animations[i];
        let action = mixer.clipAction(animation);
        action.setLoop(THREE.LoopRepeat);
        action.clampWhenFinished = false;
        action.play();
      }
    }

  });

  const grid = new THREE.GridHelper( 1000, 10, 0x808080, 0x808080 );
  grid.position.set( 0, 0, 0 );
  scene.add(grid);

  tick();
}

function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  dist   = (height / 2) / Math.tan(fovRad);
  camera.aspect = width / height;
  camera.position.set(0, height * 0.3, dist);
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function tick() {
  renderer.render(scene, camera);
  if(mixer){
    mixer.update(clock.getDelta());
  }
  scene.rotation.y += 0.002;
  requestAnimationFrame(tick);

}