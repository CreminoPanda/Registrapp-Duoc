import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerSeccionesPage } from './ver-secciones.page';

describe('VerSeccionesPage', () => {
  let component: VerSeccionesPage;
  let fixture: ComponentFixture<VerSeccionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSeccionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
