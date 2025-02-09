import { Injectable, OnDestroy, NgZone, ElementRef } from '@angular/core';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Position } from '../../models/position.model';
import { GeometryTypes } from '../../models/geometry.type';
import { MaterialTypes } from '../../models/material.type';

@Injectable({
  providedIn: 'root',
})
export class GeometrySceneService {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;

  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private clock!: THREE.Clock;

  private frameId!: number;

  private gui = new dat.GUI();

  // Lights
  private pointLight: THREE.PointLight | undefined;
  private directionalLight: THREE.DirectionalLight | undefined;

  // Reflection cube
  private reflectionCube: any;

  constructor(private ngZone: NgZone) {}

  update(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    clock: THREE.Clock
  ): void {
    this.renderer.render(scene, camera);
    var _this = this;

    this.animateWavePlane(clock);

    requestAnimationFrame(function () {
      _this.update(renderer, scene, camera, controls, clock);
    });
  }

  initGui(): void {
    this.gui = new dat.GUI();
    this.gui.addFolder('SOMETHING'); // This solves a problem with the first real creation of a folder
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
    this.clock = new THREE.Clock();

    this.update(this.renderer, this.scene, this.camera, controls, this.clock);
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

  addDirectionalLight(
    objectName: string,
    color: string = '#fff',
    intensity: number,
    withGui: boolean = true,
    withHelper: boolean = false
  ) {
    this.directionalLight = new THREE.DirectionalLight(color, intensity);
    this.directionalLight.castShadow = true;

    // Shadow
    this.directionalLight.shadow.camera.left = -10;
    this.directionalLight.shadow.camera.bottom = -10;
    this.directionalLight.shadow.camera.right = 10;
    this.directionalLight.shadow.camera.top = 10;

    // Position
    this.directionalLight.position.x = 13;
    this.directionalLight.position.y = 10;
    this.directionalLight.position.z = 10;
    this.directionalLight.intensity = 2;

    if (withGui) {
      this.gui.add(this.directionalLight, 'intensity', 0, 10);
      this.gui.add(this.directionalLight.position, 'x', 0, 20);
      this.gui.add(this.directionalLight.position, 'y', 0, 20);
      this.gui.add(this.directionalLight.position, 'z', 0, 20);
    }

    // element for that light like a Gizmo
    let sphere = this.scene.getObjectByName(objectName);
    if (sphere) this.directionalLight.add(sphere);

    this.scene.add(this.directionalLight);
  }

  async addSphere(
    w: number,
    h: number,
    d: number,
    name: string = '',
    color: string = '#fff',
    material: any,
    withGui: boolean,
    setEnvMap: boolean,
    position?: Position
  ) {
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

    // Adding texture
    meshSphere = await this.setTextures(
      meshSphere,
      'assets/textures/checkerboard.jpg',
      ['roughnessMap']
    );
    // values
    meshSphere.material.roughness = 0.7;
    meshSphere.material.metalness = 0.5;
    if (setEnvMap) meshSphere.material.envMap = this.reflectionCube;

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

    // Textures
    meshPlane = await this.setTextures(
      meshPlane,
      'assets/textures/concrete.jpg',
      ['map', 'bumpMap', 'roughnessMap'],
      15
    );
    // values
    meshPlane.material.bumpScale = 5;
    meshPlane.material.metalness = 0.3;
    meshPlane.material.roughness = 0.7;
    meshPlane.material.envMap = this.reflectionCube;

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

  async setWavePlane(
    size: number,
    segments: number,
    rotation: number,
    name: string = '',
    material: any,
    withGui?: boolean
  ) {
    let geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    let meshWave = new THREE.Mesh(geometry, material);

    meshWave.material.side = THREE.DoubleSide;

    // set name
    if (name != '') meshWave.name = name;

    meshWave.rotateX(rotation);

    meshWave.receiveShadow = true;

    // Textures
    meshWave = await this.setTextures(
      meshWave,
      'assets/textures/concrete.jpg',
      ['map', 'bumpMap', 'roughnessMap'],
      15
    );
    // values
    meshWave.material.bumpScale = 5;
    meshWave.material.metalness = 0.3;
    meshWave.material.roughness = 0.7;
    meshWave.material.envMap = this.reflectionCube;

    if (withGui) {
      var planeFolder = this.gui.addFolder('folder-' + name);
      if (meshWave.material && 'shininess' in meshWave.material) {
        planeFolder.add(meshWave.material, 'shininess', 0, 1000);
      }
      if (meshWave.material && 'roughness' in meshWave.material) {
        planeFolder.add(meshWave.material, 'roughness', 0, 1);
      }
      if (meshWave.material && 'metalness' in meshWave.material) {
        planeFolder.add(meshWave.material, 'metalness', 0, 1);
      }
      planeFolder.open();
    }

    meshWave.name = 'plane-wave';
    this.scene.add(meshWave);
  }

  animateWavePlane(clock: THREE.Clock) {
    let elapsedTime = clock.getElapsedTime();
    let plane = this.scene.getObjectByName('plane-wave') as THREE.Mesh; // Type assertion

    if (plane) {
      let geometry = plane.geometry as THREE.BufferGeometry; // Type assertion
      let positionAttribute = geometry.getAttribute(
        'position'
      ) as THREE.BufferAttribute;

      if (positionAttribute) {
        for (let i = 0; i < positionAttribute.count; i++) {
          let vertexZ = Math.sin(elapsedTime + i * 0.1) * 0.5;

          // Get the current vertex position (x, y, z)
          let x = positionAttribute.getX(i);
          let y = positionAttribute.getY(i);
          // Modify the z component
          positionAttribute.setXYZ(i, x, y, vertexZ); // Set the new vertex position
        }

        positionAttribute.needsUpdate = true; // Very important!
      } else {
        console.warn("Plane geometry doesn't have a 'position' attribute.");
      }
    }
  }

  addCubeMap() {
    let path = 'assets/cubemap/';
    let format = '.jpg';
    let urls = [
      path + 'px' + format,
      path + 'nx' + format,
      path + 'py' + format,
      path + 'ny' + format,
      path + 'pz' + format,
      path + 'nz' + format,
    ];
    let reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBAFormat;

    this.scene.background = reflectionCube;

    this.reflectionCube = reflectionCube;
  }

  setExternalModel() {
    let loader = new OBJLoader();
    let textureLoader = new THREE.TextureLoader();
    let _this = this;
    loader.load(
      '/assets/models/neil/textures_and_color_neil_medium.obj',
      function (object) {
        let colorMap = textureLoader.load('/assets/models/head/Face_Color.jpg');
        let bumpMap = textureLoader.load('/assets/models/head/Face_Disp.jpg');
        let faceMaterial = _this.getMaterial('standard', '#497D74', true);

        object.traverse((child: any) => {
          if (child.name == 'Plane') {
            child.visible = false;
          }
          if (child.name == 'Infinite') {
            child.material = faceMaterial;
            faceMaterial.roughness = 0.875;
            faceMaterial.map = colorMap;
            faceMaterial.bumpMap = bumpMap;
            faceMaterial.roughnessMap = bumpMap;
            faceMaterial.metalness = 0;
            faceMaterial.bumpScale = 0.175;
          }
        });

        object.scale.x = 20;
        object.scale.y = 20;
        object.scale.z = 20;

        object.position.z = 0;
        object.position.y = -2;
        _this.scene.add(object);
      }
    );
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
   * @param meshObject
   * @param texturePath example 'assets/textures/concrete.jpg'
   * @param mapTypes to set some by default or just send the one that you want
   * @param repeatQuantity 
   */
  async setTextures(
    meshObject: any,
    texturePath: string,
    mapTypes: string[] = ['map', 'bumpMap', 'roughnessMap'],
    repeatQuantity: number = 1.5
  ) {
    let loader = new THREE.TextureLoader();
    await mapTypes.forEach(async (mapName) => {
      meshObject.material[mapName] = loader.load(texturePath);
      meshObject.material[mapName].wrapS = THREE.RepeatWrapping;
      meshObject.material[mapName].wrapT = THREE.RepeatWrapping;
      meshObject.material[mapName].repeat.set(repeatQuantity, repeatQuantity);
    });
    meshObject.material.needsUpdate = true;

    return meshObject;
  }

  getMaterial(
    type: MaterialTypes,
    color: string = '#fff',
    wireframe?: boolean
  ) {
    let materialOptions = {
      color: color,
      wireframe: wireframe,
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

  createGeometry(
    name: string,
    type: GeometryTypes,
    size: number,
    materialType: MaterialTypes,
    wireframe: boolean,
    color: string = '#fff'
  ) {
    let geometry;
    let segmentMultiplier = 0.25;

    switch (type) {
      case 'box':
        geometry = new THREE.BoxGeometry(size, size, size);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(size, size, 256 * segmentMultiplier);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(
          size,
          size,
          size,
          32 * segmentMultiplier
        );
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(size);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(
          size,
          32 * segmentMultiplier,
          32 * segmentMultiplier
        );
        break;
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(size);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(
          size / 2,
          size / 4,
          16 * segmentMultiplier,
          100 * segmentMultiplier
        );
        break;
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(
          size / 2,
          size / 6,
          256 * segmentMultiplier,
          100 * segmentMultiplier
        );
        break;
      default:
        break;
    }

    let mate = this.getMaterial(materialType, color, wireframe);

    let mesh = new THREE.Mesh(geometry, mate);
    mesh.castShadow = true;
    mesh.name = type + '-' + name;

    this.scene.add(mesh);
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
