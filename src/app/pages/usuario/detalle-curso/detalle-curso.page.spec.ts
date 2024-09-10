import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleCursoPage } from './detalle-curso.page';

describe('DetalleCursoPage', () => {
  let component: DetalleCursoPage;
  let fixture: ComponentFixture<DetalleCursoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCursoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
