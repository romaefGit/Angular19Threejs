import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // path: 'objects-scene',
    loadComponent: () =>
      import('./pages/objects/objects.component').then(
        (c) => c.ObjectsComponent
      ),
  },
  {
    // path: '',
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
