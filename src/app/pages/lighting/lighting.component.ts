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
    let lightColor = '#7E5CAD';

    this.lightSceneService.createScene(this.lightSceneCanvas);

    this.lightSceneService.addBox(0.7, 0.7, 0.7, 'boxy');

    this.lightSceneService.addSphere(0.05, 24, 24, 'boli', lightColor);
    this.lightSceneService.addLight('boli', lightColor);

    // It use radiants, so we have to pass that math operation to say rotate 90 degrees
    this.lightSceneService.setPlane(4, Math.PI / 2, 'planito');

    this.lightSceneService.startScene();
    this.lightSceneService.setGui(); // Set controls UI
  }
}
