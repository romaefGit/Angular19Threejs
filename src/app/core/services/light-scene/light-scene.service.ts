import { Injectable, OnDestroy, NgZone, ElementRef } from '@angular/core';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Addons on threeJs https://threejs.org/docs/#manual/en/introduction/Installation
@Injectable({
  providedIn: 'root',
})
export class LightSceneService {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;

  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private cameraHelper!: THREE.CameraHelper;

  private frameId!: number;

  private gui = new dat.GUI();
  private pointLight: THREE.PointLight | undefined; // Store the point light
  private spotLight: THREE.SpotLight | undefined; // Store the spot light
  private directionalLight: THREE.DirectionalLight | undefined; // Store the directional light

  constructor(private ngZone: NgZone) {}

  update(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls
  ): void {
    this.renderer.render(scene, camera);
    var _this = this;

    requestAnimationFrame(function () {
      _this.update(renderer, scene, camera, controls);
    });
  }

  initGui(): void {
    this.gui = new dat.GUI();
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

    let controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.update(this.renderer, this.scene, this.camera, controls);
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
    this.camera.position.x = 1;
    this.camera.position.y = 2;
    this.camera.position.z = 5;

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

  addBox(
    w: number,
    h: number,
    d: number,
    name: string = '',
    returnObject: boolean = false
  ): void | THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial> {
    let geometry = new THREE.BoxGeometry(w, h, d);
    let material = new THREE.MeshPhongMaterial({
      color: 0x6a5acd,
    });

    let meshBox = new THREE.Mesh(geometry, material);

    if (name != '') meshBox.name = name;
    meshBox.position.y = meshBox.geometry.parameters.height / 2;
    meshBox.castShadow = true;

    if (!returnObject) {
      this.scene.add(meshBox);
      return undefined; // Explicitly return undefined
    } else {
      return meshBox;
    }
  }

  addLight(
    objectName: string,
    color: string = '#fff',
    yPos: number = 1,
    intensity: number = 2,
    withGui: boolean = true
  ) {
    // add light
    this.pointLight = new THREE.PointLight(color, intensity);
    this.pointLight.castShadow = true;

    // element for that light like a Gizmo
    let sphere = this.scene.getObjectByName(objectName);

    this.pointLight.position.y = yPos;

    // console.log('sphere > ', sphere);
    if (withGui) {
      this.gui
        .add(this.pointLight, 'intensity', 0, 10)
        .onChange((value: any) => {
          // No need to update the scene manually here, Three.js does it
          // console.log('Intensity changed:', value);
        });

      this.gui
        .add(this.pointLight.position, 'y', 0, 5)
        .onChange((value: any) => {
          // console.log('Y position changed:', value);
        });
    }

    if (sphere) this.pointLight.add(sphere);
    this.scene.add(this.pointLight);
  }

  addSpotLight(
    objectName: string,
    color: string = '#fff',
    intensity: number,
    withGui: boolean = true
  ) {
    this.spotLight = new THREE.SpotLight(color, intensity);

    this.spotLight.castShadow = true; // to be able to have shadow
    this.spotLight.shadow.bias = 0.001; // To fix a shadow bordered behind objects
    this.spotLight.shadow.mapSize.width = 2048;
    this.spotLight.shadow.mapSize.height = 2048;

    this.scene.add(this.spotLight);

    // element for that light like a Gizmo
    let sphere = this.scene.getObjectByName(objectName);

    if (withGui) {
      this.gui.add(this.spotLight, 'intensity', 0, 10);
      this.gui.add(this.spotLight.position, 'x', 0, 20);
      this.gui.add(this.spotLight.position, 'y', 0, 20);
      this.gui.add(this.spotLight.position, 'z', 0, 20);
      this.gui.add(this.spotLight, 'penumbra', 0, 1);
    }

    if (sphere) this.spotLight.add(sphere);
    this.scene.add(this.spotLight);
    // return light;
  }

  addDirectionalLight(
    objectName: string,
    color: string = '#fff',
    intensity: number,
    withGui: boolean = true,
    withHelper: boolean = false
  ) {
    this.directionalLight = new THREE.DirectionalLight(color, intensity);
    this.directionalLight.castShadow = true;

    this.directionalLight.shadow.camera.left = -10;
    this.directionalLight.shadow.camera.bottom = -10;
    this.directionalLight.shadow.camera.right = 10;
    this.directionalLight.shadow.camera.top = 10;

    if (withGui) {
      this.gui.add(this.directionalLight, 'intensity', 0, 10);
      this.gui.add(this.directionalLight.position, 'x', 0, 20);
      this.gui.add(this.directionalLight.position, 'y', 0, 20);
      this.gui.add(this.directionalLight.position, 'z', 0, 20);
    }

    if (withHelper) {
      this.cameraHelper = new THREE.CameraHelper(
        this.directionalLight.shadow.camera
      );
    }

    // element for that light like a Gizmo
    let sphere = this.scene.getObjectByName(objectName);
    if (sphere) this.directionalLight.add(sphere);

    this.scene.add(this.directionalLight);
    this.scene.add(this.cameraHelper);
  }

  addSphere(
    w: number,
    h: number,
    d: number,
    name: string = '',
    color: string = '#fff'
  ): void {
    let geometry = new THREE.SphereGeometry(w, h, d);
    let material = new THREE.MeshBasicMaterial({
      color: color,
    });

    let meshSphere = new THREE.Mesh(geometry, material);
    // set name
    if (name != '') meshSphere.name = name;

    meshSphere.castShadow = true;

    this.scene.add(meshSphere);
  }

  setPlane(size: number, rotation: number, name: string = '') {
    let geometry = new THREE.PlaneGeometry(size, size);
    let material = new THREE.MeshPhongMaterial({
      color: '#ffff',
      side: THREE.DoubleSide,
    });
    let meshPlane = new THREE.Mesh(geometry, material);

    // set name
    if (name != '') meshPlane.name = name;

    meshPlane.rotateX(rotation);

    meshPlane.receiveShadow = true;

    this.scene.add(meshPlane);
  }

  addBoxGrid(amount: number, separationMultiplier: number) {
    let boxGridGroup = new THREE.Group();

    for (let i = 0; i < amount; i++) {
      let obj = this.addBox(1, 1, 1, 'cube-' + i, true);
      if (obj) {
        obj.position.x = i * separationMultiplier;
        obj.position.y = obj.geometry.parameters.height / 2;
        boxGridGroup.add(obj);
        for (var j = 1; j < amount; j++) {
          let objTwo = this.addBox(1, 1, 1, 'cube-' + i + '-j', true);
          if (objTwo) {
            objTwo.position.x = i * separationMultiplier;
            objTwo.position.y = objTwo.geometry.parameters.height / 2;
            objTwo.position.z = j * separationMultiplier;
            boxGridGroup.add(objTwo);
          }
        }
      }
    }

    boxGridGroup.position.x = -(separationMultiplier * (amount - 1)) / 2;
    boxGridGroup.position.z = -(separationMultiplier * (amount - 1)) / 2;

    this.scene.add(boxGridGroup);
    // return boxGridGroup;
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
