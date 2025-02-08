import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { SceneService } from '../../core/services/scene/scene.service';

@Component({
  selector: 'app-simple-scene',
  imports: [],
  templateUrl: './simple-scene.component.html',
  styleUrl: './simple-scene.component.scss',
})
export class SimpleSceneComponent implements OnInit {
  @ViewChild('simpleScene', { static: true })
  public simpleSceneCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private sceneService: SceneService) {}

  public ngOnInit(): void {
    this.sceneService.createScene(this.simpleSceneCanvas);
    this.sceneService.addBox(1, 1, 1);

    // It use radiants, so we have to pass that math operation to say rotate 90 degrees
    this.sceneService.setPlane(4, Math.PI / 2);

    this.sceneService.startScene();
  }
}
