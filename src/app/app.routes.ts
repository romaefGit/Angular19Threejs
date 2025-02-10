import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // Empty path
    redirectTo: 'lighting', // Redirect to 'lighting'
    pathMatch: 'full', // Important: Match the full path
  },
  {
    path: 'particles',
    loadComponent: () =>
      import('./pages/particles/particles.component').then(
        (c) => c.ParticlesComponent
      ),
  },
  {
    path: 'geometry',
    loadComponent: () =>
      import('./pages/geometry/geometry.component').then(
        (c) => c.GeometryComponent
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
    path: 'animation',
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
];
