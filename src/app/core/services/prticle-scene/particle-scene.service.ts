import { Injectable, OnDestroy, NgZone, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

@Injectable({
  providedIn: 'root',
})
export class ParticleSceneService {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;

  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;

  private frameId!: number;

  private particleSystem!: THREE.Points;

  constructor(private ngZone: NgZone) {}

  update(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    composer: EffectComposer,
    controls: OrbitControls
  ) {
    // console.log('it enters always?');

    this.renderer.render(scene, camera);
    var _this = this;

    // To set some transformation in real time to the objects on scene
    // var planeRotation = this.scene.getObjectByName('planito');
    // if (planeRotation) {
    //   planeRotation.rotation.y += 0.001;
    //   planeRotation.rotation.z += 0.001;
    // }

    // this.scene.traverse(function (child) {
    //   child.scale.x += 0.001;
    // });

    this.animateParticles();

    requestAnimationFrame(function () {
      _this.update(renderer, scene, camera, composer, controls);
    });
  }

  startScene(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });

    var composer = new EffectComposer(this.renderer);
    var renderPass = new RenderPass(this.scene, this.camera);
    composer.addPass(renderPass);

    var vignetteEffect = new ShaderPass(VignetteShader);
    vignetteEffect.uniforms['darkness'].value = 2;
    composer.addPass(vignetteEffect);

    var rgbShiftShader = new ShaderPass(RGBShiftShader);
    rgbShiftShader.uniforms['amount'].value = 0.003;
    rgbShiftShader.renderToScreen = true;
    composer.addPass(rgbShiftShader);

    let controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.update(this.renderer, this.scene, this.camera, composer, controls);
  }

  createScene(
    canvas: ElementRef<HTMLCanvasElement>,
    enableFog: boolean = false,
    enableShadows: boolean = false,
    color: string = '#EFB6C8'
  ): void {
    // create the scene
    this.scene = new THREE.Scene();

    // First configuration
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    // Setting camera position
    this.camera.position.z = 7;
    this.camera.position.x = -2;
    this.camera.position.y = 7;

    // This center the camera view to the center of the object
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Add camera
    this.scene.add(this.camera);

    // renderer config
    this.canvas = canvas.nativeElement;

    // Renderer config
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: false, // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(color); // background color of the scene

    // to active shadows
    this.renderer.shadowMap.enabled = enableShadows; // the activate that on the objects with .castShadows property

    // Fog
    if (enableFog) {
      this.scene.fog = new THREE.FogExp2('#A9B5DF', 0.2); // Fog color in elements
    }

    // console.log(this.scene);
  }

  addBox(w: number, h: number, d: number, name: string = ''): void {
    let geometry = new THREE.BoxGeometry(w, h, d);
    let material = new THREE.MeshBasicMaterial({
      color: '#ddd',
    });

    let meshBox = new THREE.Mesh(geometry, material);

    // set name
    if (name != '') meshBox.name = name;

    // to set the element on top of the Horizon line
    meshBox.position.y = meshBox.geometry.parameters.height / 2;

    this.scene.add(meshBox);
  }

  setPlane(size: number, rotation: number, name: string = '') {
    let geometry = new THREE.PlaneGeometry(size, size);
    let material = new THREE.MeshBasicMaterial({
      color: 0x009688,
      side: THREE.DoubleSide,
    });
    let meshPlane = new THREE.Mesh(geometry, material);

    // set name
    if (name != '') meshPlane.name = name;

    meshPlane.rotateX(rotation);
    this.scene.add(meshPlane);
  }

  createParticles(
    particleCount: number = 2000,
    particleDistance: number = 100
  ) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3); // 3 values (x, y, z) per particle

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * particleDistance;
      const y = (Math.random() - 0.5) * particleDistance;
      const z = (Math.random() - 0.5) * particleDistance;

      // Store the position in the Float32Array
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // Important!

    const particleTexture = new THREE.TextureLoader().load(
      'assets/textures/particle.jpg'
      // (texture) => {
      //   console.log('texture > ', texture);
      // }
    );

    const material = new THREE.PointsMaterial({
      color: 'rgb(255, 255, 255)',
      size: 1,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // console.log('material > ', material);

    const particleSystem = new THREE.Points(geometry, material);
    this.scene.add(particleSystem);

    // Store a reference to the particle system for later animation, if needed:
    this.particleSystem = particleSystem; // Or add it to an array of particle systems
  }

  animateParticles() {
    if (this.particleSystem) {
      const positions = this.particleSystem.geometry.getAttribute(
        'position'
      ) as THREE.BufferAttribute;

      for (let i = 0; i < positions.count; i++) {
        let x = positions.getX(i);
        let y = positions.getY(i);
        let z = positions.getZ(i);

        x += (Math.random() - 0.5) * 0.1; // Adjusted range for -1 to 1
        y += (Math.random() - 0.75) * 0.1;
        z += Math.random() * 0.1;

        if (x < -50) {
          x = 50;
        }

        if (y < -50) {
          y = 50;
        }

        if (z < -50) {
          z = 50;
        }

        if (z > 50) {
          z = -50;
        }

        positions.setXYZ(i, x, y, z); // Update the position
      }

      positions.needsUpdate = true;
    }
  }

  render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.renderer.render(this.scene, this.camera);
  }

  resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      // this.renderer = null;
      // this.canvas = null;
    }
  }
}
