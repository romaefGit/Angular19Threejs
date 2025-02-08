import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSceneComponent } from './simple-scene.component';

describe('SimpleSceneComponent', () => {
  let component: SimpleSceneComponent;
  let fixture: ComponentFixture<SimpleSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleSceneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
