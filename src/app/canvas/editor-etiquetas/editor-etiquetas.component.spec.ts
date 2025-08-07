import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorEtiquetasComponent } from './editor-etiquetas.component';

describe('EditorEtiquetasComponent', () => {
  let component: EditorEtiquetasComponent;
  let fixture: ComponentFixture<EditorEtiquetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorEtiquetasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorEtiquetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
