import { TestBed } from '@angular/core/testing';

import { TextureMaterialSceneService } from './texture-material-scene.service';

describe('TextureMaterialSceneService', () => {
  let service: TextureMaterialSceneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextureMaterialSceneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
