import { Injectable, OnDestroy, NgZone, ElementRef } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class SceneService implements OnDestroy {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;

  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;

  private frameId!: number;

  constructor(private ngZone: NgZone) {}

  update(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
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

    requestAnimationFrame(function () {
      _this.update(renderer, scene, camera);
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

    this.update(this.renderer, this.scene, this.camera);
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
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

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: false, // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setClearColor('#EFB6C8'); // background color of the scene

    this.scene.fog = new THREE.FogExp2('#A9B5DF', 0.2); // Fog color in elements

    // console.log(this.scene);
  }

  addBox(w: number, h: number, d: number, name: string = ''): void {
    let geometry = new THREE.BoxGeometry(w, h, d);
    let material = new THREE.MeshBasicMaterial({
      color: 0x6a5acd,
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
