import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { SceneService } from '../../core/services/scene/scene.service';

@Component({
  selector: 'app-objects',
  imports: [],
  templateUrl: './objects.component.html',
  styleUrl: './objects.component.scss',
})
export class ObjectsComponent {
  @ViewChild('objectScene', { static: true })
  public objectSceneCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private sceneService: SceneService) {}

  public ngOnInit(): void {
    this.sceneService.createScene(this.objectSceneCanvas);

    this.sceneService.addBox(1, 1, 1, 'boxy');

    // It use radiants, so we have to pass that math operation to say rotate 90 degrees
    this.sceneService.setPlane(4, Math.PI / 2, 'planito');

    this.sceneService.startScene();
  }
}
