import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { SceneService } from '../../core/services/scene/scene.service';
import { LightSceneService } from '../../core/services/light-scene/light-scene.service';

@Component({
  selector: 'app-lighting',
  imports: [],
  templateUrl: './lighting.component.html',
  styleUrl: './lighting.component.scss',
})
export class LightingComponent {
  @ViewChild('lightScene', { static: true })
  public lightSceneCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private lightSceneService: LightSceneService) {}

  public ngOnInit(): void {
    let sceneColor = '#213555';

    let lightColor = '#FFFDEC';
    let spotLightColor = '#79D7BE';
    let directionalLightColor = '#CDC1FF';
    let ambientLightColor = '#DA498D';

    this.lightSceneService.initGui(); // Set controls UI
    this.lightSceneService.createScene(
      this.lightSceneCanvas,
      false,
      true,
      sceneColor
    );

    this.lightSceneService.addBox(0.7, 0.7, 0.7, 'boxy');
    this.lightSceneService.addBoxGrid(6, 1.8);

    // Point Light
    this.lightSceneService.addSphere(0.05, 24, 24, 'boli', lightColor);
    this.lightSceneService.addLight('boli', lightColor, 2, 2, false);

    // Spot Light
    this.lightSceneService.addSphere(0.05, 24, 24, 'spoti', spotLightColor);
    this.lightSceneService.addSpotLight('spoti', spotLightColor, 6, false);

    // Directional Light
    this.lightSceneService.addSphere(
      0.05,
      24,
      24,
      'directi',
      directionalLightColor
    );
    this.lightSceneService.addDirectionalLight(
      'directi',
      directionalLightColor,
      1,
      false,
      true
    );

    // Ambient light
    this.lightSceneService.addSphere(
      0.05,
      24,
      24,
      'ambienti',
      ambientLightColor
    );
    this.lightSceneService.addAmbientLight(
      'ambienti',
      ambientLightColor,
      1,
      false
    );

    // react area light test
    this.lightSceneService.addReactAreaLight();

    // It use radiants, so we have to pass that math operation to say rotate 90 degrees
    this.lightSceneService.setPlane(16, Math.PI / 2, 'planito');

    this.lightSceneService.startScene();
  }
}
