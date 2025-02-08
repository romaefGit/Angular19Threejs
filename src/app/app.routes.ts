import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // path: 'textures-and-materials',
    loadComponent: () =>
      import(
        './pages/textures-and-materials/textures-and-materials.component'
      ).then((c) => c.TexturesAndMaterialsComponent),
  },
  {
    path: 'animation',
    loadComponent: () =>
      import('./pages/animation/animation.component').then(
        (c) => c.AnimationComponent
      ),
  },
  {
    path: 'textures-and-materials',
    loadComponent: () =>
      import(
        './pages/textures-and-materials/textures-and-materials.component'
      ).then((c) => c.TexturesAndMaterialsComponent),
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
