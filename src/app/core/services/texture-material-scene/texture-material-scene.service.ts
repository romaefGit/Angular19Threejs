import { Injectable, OnDestroy, NgZone, ElementRef } from '@angular/core';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { Position } from '../../models/position.model';

@Injectable({
  providedIn: 'root',
})
export class TextureMaterialSceneService {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;

  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private cameraHelper!: THREE.CameraHelper;

  private frameId!: number;

  private gui = new dat.GUI();

  // Lights
  private pointLight: THREE.PointLight | undefined;
  private spotLight: THREE.SpotLight | undefined;
  private directionalLight: THREE.DirectionalLight | undefined;
  private ambientLight: THREE.AmbientLight | undefined;

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
    let folderEmpty = this.gui.addFolder('SOMETHING'); // This solves a problem with the first real creation of a folder
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
    withGui: boolean = true,
    position?: Position
  ) {
    let spotLight = new THREE.SpotLight(color, intensity);

    spotLight.castShadow = true; // to be able to have shadow
    spotLight.shadow.bias = 0.001; // To fix a shadow bordered behind objects
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;

    this.scene.add(spotLight);

    // element for that light like a Gizmo
    let sphere = this.scene.getObjectByName(objectName);

    if (withGui) {
      let folderLight = this.gui.addFolder('folder-' + objectName);
      folderLight.add(spotLight, 'intensity', 0, 10);
      folderLight.add(spotLight.position, 'x', -5, 15);
      folderLight.add(spotLight.position, 'y', -5, 15);
      folderLight.add(spotLight.position, 'z', -5, 15);
      folderLight.add(spotLight, 'penumbra', 0, 1);
      folderLight.open();
    }

    if (position) {
      if (position.y) spotLight.position.y = position.y;
      if (position.x) spotLight.position.x = position.x;
      if (position.z) spotLight.position.z = position.z;
    }

    if (sphere) spotLight.add(sphere);
    this.scene.add(spotLight);
    // return light;
  }

  addSphere(
    w: number,
    h: number,
    d: number,
    name: string = '',
    color: string = '#fff',
    material: any,
    withGui: boolean,
    position?: Position
  ): void {
    let geometry = new THREE.SphereGeometry(w, h, d);

    let meshSphere = new THREE.Mesh(geometry, material);
    // set name
    if (name != '') meshSphere.name = name;

    meshSphere.castShadow = true;

    if (position) {
      if (!position.y) {
        meshSphere.position.y = meshSphere.geometry.parameters.radius;
      }
      if (position.x) meshSphere.position.x = position.x;
      if (position.y) meshSphere.position.y = position.y;
      if (position.z) meshSphere.position.z = position.z;
    } else {
      // to center the sphere on top of the plane
      meshSphere.position.y = meshSphere.geometry.parameters.radius;
    }

    if (withGui) {
      // console.log('meshSphere  > ', meshSphere);
      var sphereFolder = this.gui.addFolder('folder-' + name);
      if (meshSphere.material && 'shininess' in meshSphere.material) {
        sphereFolder.add(meshSphere.material, 'shininess', 0, 1000);
      }
      if (meshSphere.material && 'roughness' in meshSphere.material) {
        sphereFolder.add(meshSphere.material, 'roughness', 0, 1);
      }
      if (meshSphere.material && 'metalness' in meshSphere.material) {
        sphereFolder.add(meshSphere.material, 'metalness', 0, 1);
      }
      sphereFolder.open();
    }

    this.scene.add(meshSphere);
  }

  getMaterial(
    type: 'basic' | 'lambert' | 'phong' | 'standard',
    color: string = '#fff'
  ) {
    let materialOptions = {
      color: color,
    };
    let selectedMaterial: any;

    switch (type) {
      case 'basic':
        selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
        break;
      case 'lambert':
        selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
        break;
      case 'phong':
        selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
        break;
      case 'standard':
        selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
        break;
      default:
        selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
        break;
    }

    return selectedMaterial;
  }

  /**
   * Set textures
   * callback of loader
   * loader.load(
        texturePath,  // Correct path for Angular's assets folder
        (texture) => {
          console.log(texture)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded'); // Optional progress
        },
        (err) => {
            console.error("Error loading texture:", err);
        }
    );
   * @param meshPlane
   * @param texturePath example 'assets/textures/concrete.jpg'
   */
  async setTextures(meshPlane: any, texturePath: string) {
    let loader = new THREE.TextureLoader();
    meshPlane.material.map = loader.load(texturePath);
    meshPlane.material.bumpMap = loader.load(texturePath);
    meshPlane.material.bumpScale = 20;

    let maps = ['map', 'bumpMap'];
    await maps.forEach(async function (mapName) {
      let texture = meshPlane.material[mapName];
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1.5, 1.5);
    });
    meshPlane.material.needsUpdate = true;

    return meshPlane;
  }

  async setPlane(
    size: number,
    rotation: number,
    name: string = '',
    material: any,
    withGui?: boolean
  ) {
    let geometry = new THREE.PlaneGeometry(size, size);
    let meshPlane = new THREE.Mesh(geometry, material);
    meshPlane.material.side = THREE.DoubleSide;

    // set name
    if (name != '') meshPlane.name = name;

    meshPlane.rotateX(rotation);

    meshPlane.receiveShadow = true;

    meshPlane = await this.setTextures(
      meshPlane,
      'assets/textures/concrete.jpg'
    );

    if (withGui) {
      var planeFolder = this.gui.addFolder('folder-' + name);
      if (meshPlane.material && 'shininess' in meshPlane.material) {
        planeFolder.add(meshPlane.material, 'shininess', 0, 1000);
      }
      if (meshPlane.material && 'roughness' in meshPlane.material) {
        planeFolder.add(meshPlane.material, 'roughness', 0, 1);
      }
      if (meshPlane.material && 'metalness' in meshPlane.material) {
        planeFolder.add(meshPlane.material, 'metalness', 0, 1);
      }
      planeFolder.open();
    }

    this.scene.add(meshPlane);
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
