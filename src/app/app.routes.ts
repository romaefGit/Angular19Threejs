import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/engine/engine.component').then(
        (c) => c.EngineComponent
      ),
  },
];
