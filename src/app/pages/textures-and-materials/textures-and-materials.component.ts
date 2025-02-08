import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { TextureMaterialSceneService } from '../../core/services/texture-material-scene/texture-material-scene.service';

@Component({
  selector: 'app-textures-and-materials',
  imports: [],
  templateUrl: './textures-and-materials.component.html',
  styleUrl: './textures-and-materials.component.scss',
})
export class TexturesAndMaterialsComponent {
  @ViewChild('texturesMaterialScene', { static: true })
  public texturesMaterialCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(
    private textureMaterialService: TextureMaterialSceneService
  ) {}

  public ngOnInit(): void {
    let sceneColor = '#213555';

    let lightColor = '#FFFDEC';
    let spotLightColor = '#79D7BE';
    let directionalLightColor = '#CDC1FF';
    let ambientLightColor = '#DA498D';

    this.textureMaterialService.initGui(); // Set controls UI
    this.textureMaterialService.createScene(
      this.texturesMaterialCanvas,
      false,
      true,
      sceneColor
    );

    // Add sphere with material
    this.textureMaterialService.addSphere(
      0.7,
      25,
      25,
      'boxy',
      '#FFFDEC',
      this.textureMaterialService.getMaterial('lambert', '#DA498D')
    );

    // Point Light
    // this.textureMaterialService.addSphere(
    //   0.05,
    //   24,
    //   24,
    //   'boli',
    //   lightColor,
    //   this.textureMaterialService.getMaterial('basic')
    // );
    // this.textureMaterialService.addLight('boli', lightColor, 2, 2, false);

    // Spot Light
    // this.textureMaterialService.addSphere(
    //   0.05,
    //   24,
    //   24,
    //   'spoti',
    //   spotLightColor,
    //   this.textureMaterialService.getMaterial('basic')
    // );
    // this.textureMaterialService.addSpotLight('spoti', spotLightColor, 6, false);

    // Directional Light
    this.textureMaterialService.addSphere(
      0.05,
      24,
      24,
      'directi',
      directionalLightColor,
      this.textureMaterialService.getMaterial('basic')
    );
    this.textureMaterialService.addDirectionalLight(
      'directi',
      directionalLightColor,
      1,
      false,
      false
    );

    // It use radiants, so we have to pass that math operation to say rotate 90 degrees
    this.textureMaterialService.setPlane(16, Math.PI / 2, 'planito');

    this.textureMaterialService.startScene();
  }
}
