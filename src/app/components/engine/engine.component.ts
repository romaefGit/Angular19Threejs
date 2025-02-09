import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { EngineService } from '../../core/services/engine/engine.service';

@Component({
  selector: 'app-engine',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './engine.component.html',
})
export class EngineComponent {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private engineService: EngineService) {}

  public ngOnInit(): void {
    this.engineService.createScene(this.rendererCanvas);
    this.engineService.animate();
  }
}
