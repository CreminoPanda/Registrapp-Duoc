import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizarInformacionPersonalPage } from './actualizar-informacion-personal.page';

describe('ActualizarInformacionPersonalPage', () => {
  let component: ActualizarInformacionPersonalPage;
  let fixture: ComponentFixture<ActualizarInformacionPersonalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarInformacionPersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
