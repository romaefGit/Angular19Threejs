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

  public constructor(private geometrySceneService: GeometrySceneService) {}

  public ngOnInit(): void {
    let sceneColor = '#213555';

    let spotLightColor = '#FFFDEC';
    let directionalLightColor = '#CDC1FF';
    let ambientLightColor = '#DA498D';

    this.geometrySceneService.initGui(); // Set controls UI
    this.geometrySceneService.createScene(
      this.geometryCanvas,
      false,
      true,
      sceneColor
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

    // Choose one type of geometry
    var geoTypes: GeometryTypes[] = [
      // <-- Key change: Array of GeometryTypes
      // 'box',
      // 'cone',
      // 'cylinder',
      // 'sphere',
      // 'torus',
      'torusKnot',
      // 'octahedron',
      // 'tetrahedron',
    ];

    this.geometrySceneService.createGeometry(
      'test',
      geoTypes[0],
      2,
      'phong',
      false,
      '#DA498D'
    );

    // Wave plane
    let wireframe = false;
    let withGui = true;
    this.geometrySceneService.setWavePlane(
      30,
      60,
      Math.PI / 2,
      'planito',
      this.geometrySceneService.getMaterial('standard', '#CDC1FF', wireframe),
      withGui
    );

    this.geometrySceneService.addCubeMap();

    this.geometrySceneService.startScene();
  }
}
