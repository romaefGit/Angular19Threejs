import { TestBed } from '@angular/core/testing';

import { LightSceneService } from './light-scene.service';

describe('LightSceneService', () => {
  let service: LightSceneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LightSceneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
