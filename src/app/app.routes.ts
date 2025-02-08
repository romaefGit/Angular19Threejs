import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // path: 'simple-scene',
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
