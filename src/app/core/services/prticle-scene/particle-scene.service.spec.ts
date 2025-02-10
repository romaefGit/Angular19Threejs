import { TestBed } from '@angular/core/testing';

import { ParticleSceneService } from './particle-scene.service';

describe('ParticleSceneService', () => {
  let service: ParticleSceneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticleSceneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
