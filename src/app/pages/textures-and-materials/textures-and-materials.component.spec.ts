import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TexturesAndMaterialsComponent } from './textures-and-materials.component';

describe('TexturesAndMaterialsComponent', () => {
  let component: TexturesAndMaterialsComponent;
  let fixture: ComponentFixture<TexturesAndMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TexturesAndMaterialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TexturesAndMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
