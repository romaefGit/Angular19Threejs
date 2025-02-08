import { Component, ViewChild, ElementRef } from '@angular/core';
import { AnimationSceneService } from '../../core/services/animation-scene/animation-scene.service';

@Component({
  selector: 'app-animation',
  imports: [],
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.scss',
})
export class AnimationComponent {
  @ViewChild('animationScene', { static: true })
  public animationSceneCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private animationSceneService: AnimationSceneService) {}

  public ngOnInit(): void {
    let sceneColor = '#213555';

    let lightColor = '#FFFDEC';
    let spotLightColor = '#79D7BE';
    let directionalLightColor = '#CDC1FF';
    let ambientLightColor = '#DA498D';

    this.animationSceneService.initGui(); // Set controls UI
    this.animationSceneService.createScene(
      this.animationSceneCanvas,
      false,
      true,
      sceneColor,
      'perspective'
    );

    // Box
    this.animationSceneService.addBox(0.7, 0.7, 0.7, 'boxy');

    // Box grid
    this.animationSceneService.addBoxGrid(12, 1.8, 'boxGridi');

    // Point Light
    this.animationSceneService.addSphere(0.05, 24, 24, 'boli', lightColor);
    this.animationSceneService.addLight('boli', lightColor, 2, 2, false);

    // Spot Light
    this.animationSceneService.addSphere(0.05, 24, 24, 'spoti', spotLightColor);
    this.animationSceneService.addSpotLight('spoti', spotLightColor, 6, false);

    // Directional Light
    this.animationSceneService.addSphere(
      0.05,
      24,
      24,
      'directi',
      directionalLightColor
    );
    this.animationSceneService.addDirectionalLight(
      'directi',
      directionalLightColor,
      1,
      false,
      false
    );

    // Ambient light
    this.animationSceneService.addSphere(
      0.05,
      24,
      24,
      'ambienti',
      ambientLightColor
    );
    this.animationSceneService.addAmbientLight(
      'ambienti',
      ambientLightColor,
      1,
      false
    );

    // It use radians, so we have to pass that math operation to say rotate 90 degrees
    this.animationSceneService.setPlane(100, Math.PI / 2, 'planito');

    // Set Camera Rig
    this.animationSceneService.setCameraRigGui();

    this.animationSceneService.startScene();
  }
}
