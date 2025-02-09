import { TestBed } from '@angular/core/testing';

import { GeometrySceneService } from './geometry-scene.service';

describe('GeometrySceneService', () => {
  let service: GeometrySceneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeometrySceneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
