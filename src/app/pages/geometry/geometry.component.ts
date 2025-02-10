import { Component, ViewChild, ElementRef } from '@angular/core';
import { GeometrySceneService } from '../../core/services/geometry-scene/geometry-scene.service';
import { GeometryTypes } from '../../core/models/geometry.type';

@Component({
  selector: 'app-geometry',
  imports: [],
  templateUrl: './geometry.component.html',
  styleUrl: './geometry.component.scss',
})
export class GeometryComponent {
  @ViewChild('geometryScene', { static: true })
  public geometryCanvas!: ElementRef<HTMLCanvasElement>;

  public geoTypes: GeometryTypes[] = [
    'box',
    'cone',
    'cylinder',
    'sphere',
    'torus',
    'torusKnot',
    'octahedron',
    'tetrahedron',
  ];

  public constructor(private geometrySceneService: GeometrySceneService) {}

  public ngOnInit(): void {
    let sceneColor = '#213555';

    let spotLightColor = '#FFFDEC';
    let directionalLightColor = '#497D74';
    let ambientLightColor = '#DA498D';

    this.geometrySceneService.initGui(); // Set controls UI
    this.geometrySceneService.createScene(
      this.geometryCanvas,
      false,
      true,
      sceneColor
    );

    // Directional Light
    this.geometrySceneService.addSphere(
      0.05,
      24,
      24,
      'directi',
      directionalLightColor,
      this.geometrySceneService.getMaterial('basic'),
      false,
      false
    );
    this.geometrySceneService.addDirectionalLight(
      'directi',
      directionalLightColor,
      1,
      false,
      true
    );

    // Spot Left Light
    let positionLeftLight = {
      x: -2,
      y: 2,
      z: -2,
    };
    this.geometrySceneService.addSphere(
      0.05,
      24,
      24,
      'left-spoti',
      spotLightColor,
      this.geometrySceneService.getMaterial('basic'),
      false,
      false,
      positionLeftLight
    );
    this.geometrySceneService.addSpotLight(
      'left-spoti',
      spotLightColor,
      6,
      true,
      positionLeftLight
    );

    // Spot Right Light
    let positionRightLight = {
      x: 2,
      y: 2,
      z: -2,
    };
    this.geometrySceneService.addSphere(
      0.05,
      24,
      24,
      'right-spoti',
      spotLightColor,
      this.geometrySceneService.getMaterial('basic'),
      false,
      false,
      positionRightLight
    );
    this.geometrySceneService.addSpotLight(
      'right-spoti',
      spotLightColor,
      6,
      true,
      positionRightLight
    );

    // Create geometries
    this.createRoundGeometries(1, 4, 2);

    // Wave plane
    let wireframe = false;
    let withGui = true;
    this.geometrySceneService.setWavePlane(
      15,
      60,
      Math.PI / 2,
      'planito',
      this.geometrySceneService.getMaterial('standard', '#000', wireframe),
      withGui
    );

    // External model
    let faceModel: any = {
      obj: '/assets/models/head/lee-perry-smith-head-scan.obj',
      scale: {
        x: 4,
        y: 4,
        z: 4,
      },
      position: {
        x: 1,
        y: 0,
        z: 0.5,
      },
      colorMap: '/assets/models/head/Face_Color.jpg',
      bumpMap: '/assets/models/head/Face_Disp.jpg',
    };
    this.geometrySceneService.setExternalModel(
      faceModel.obj,
      faceModel.scale,
      faceModel.position,
      faceModel.colorMap,
      faceModel.bumpMap
    );

    // Neil model
    let neilModel: any = {
      obj: '/assets/models/neil/textures_and_color_neil_medium.obj',
      scale: {
        x: 2,
        y: 2,
        z: 2,
      },
      position: {
        x: -1,
        y: 0.3,
        z: 0,
      },
    };
    this.geometrySceneService.setExternalModel(
      neilModel.obj,
      neilModel.scale,
      neilModel.position
    );

    this.geometrySceneService.addCubeMap();

    this.geometrySceneService.startScene();
  }

  createRoundGeometries(
    size: number = 2,
    radius: number = 4,
    yPos: number = 3
  ) {
    for (let i = 0; i < this.geoTypes.length; i++) {
      const randomType = this.geoTypes[i];
      const angle = (i / this.geoTypes.length) * 2 * Math.PI; // Calculate angle for each element

      let position = {
        x: Math.cos(angle) * radius, // x = radius * cos(angle)
        z: Math.sin(angle) * radius, // z = radius * sin(angle)
        y: yPos,
      };

      this.geometrySceneService.createGeometry(
        'geometry' + i,
        randomType,
        size,
        'standard',
        true,
        '#DA498D',
        position
      );
    }
  }
}
