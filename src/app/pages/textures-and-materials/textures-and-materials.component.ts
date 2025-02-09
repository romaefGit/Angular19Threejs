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

    let spotLightColor = '#FFFDEC';
    let directionalLightColor = '#CDC1FF';
    let ambientLightColor = '#DA498D';

    this.textureMaterialService.initGui(); // Set controls UI
    this.textureMaterialService.createScene(
      this.texturesMaterialCanvas,
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
    this.textureMaterialService.addSphere(
      0.05,
      24,
      24,
      'left-spoti',
      spotLightColor,
      this.textureMaterialService.getMaterial('basic'),
      false,
      positionLeftLight
    );
    this.textureMaterialService.addSpotLight(
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
    this.textureMaterialService.addSphere(
      0.05,
      24,
      24,
      'right-spoti',
      spotLightColor,
      this.textureMaterialService.getMaterial('basic'),
      false,
      positionRightLight
    );
    this.textureMaterialService.addSpotLight(
      'right-spoti',
      spotLightColor,
      6,
      true,
      positionRightLight
    );

    // Add sphere with material
    this.textureMaterialService.addSphere(
      1,
      25,
      25,
      'spherei',
      '#FFFDEC',
      this.textureMaterialService.getMaterial('phong', '#DA498D'),
      false
      // {
      //   x: 0,
      //   y: 7,
      //   z: 0,
      // }
    );

    // It use radiants, so we have to pass that math operation to say rotate 90 degrees
    this.textureMaterialService.setPlane(
      16,
      Math.PI / 2,
      'planito',
      this.textureMaterialService.getMaterial('phong', '#ddd'),
      false
    );

    this.textureMaterialService.startScene();
  }
}
