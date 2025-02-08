import { TestBed } from '@angular/core/testing';

import { AnimationSceneService } from './animation-scene.service';

describe('AnimationSceneService', () => {
  let service: AnimationSceneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationSceneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
