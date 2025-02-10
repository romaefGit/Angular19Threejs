import { Component, ViewChild, ElementRef } from '@angular/core';
import { ParticleSceneService } from '../../core/services/prticle-scene/particle-scene.service';

@Component({
  selector: 'app-particles',
  imports: [],
  templateUrl: './particles.component.html',
  styleUrl: './particles.component.scss',
})
export class ParticlesComponent {
  @ViewChild('particleScene', { static: true })
  public particleSceneCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private particleSceneService: ParticleSceneService) {}

  public ngOnInit(): void {
    // Scene
    this.particleSceneService.createScene(
      this.particleSceneCanvas,
      false,
      true
    );
    // Box
    this.particleSceneService.addBox(1, 1, 1, 'boxy');

    // Plane
    // It use radiants, so we have to pass that math operation to say rotate 90 degrees
    this.particleSceneService.setPlane(4, Math.PI / 2, 'planito');

    this.particleSceneService.createParticles(8000);

    this.particleSceneService.startScene();
  }
}
