import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // path: 'animation',
    loadComponent: () =>
      import('./pages/animation/animation.component').then(
        (c) => c.AnimationComponent
      ),
  },
  {
    path: 'lighting',
    loadComponent: () =>
      import('./pages/lighting/lighting.component').then(
        (c) => c.LightingComponent
      ),
  },
  {
    path: 'objects-scene',
    loadComponent: () =>
      import('./pages/objects/objects.component').then(
        (c) => c.ObjectsComponent
      ),
  },
  {
    path: 'simple-scene',
    loadComponent: () =>
      import('./pages/simple-scene/simple-scene.component').then(
        (c) => c.SimpleSceneComponent
      ),
  },
  {
    path: 'cube',
    loadComponent: () =>
      import('./components/engine/engine.component').then(
        (c) => c.EngineComponent
      ),
  },
];
