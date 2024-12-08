import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerClasesPendientesPage } from './ver-clases-pendientes.page';

describe('VerClasesPendientesPage', () => {
  let component: VerClasesPendientesPage;
  let fixture: ComponentFixture<VerClasesPendientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerClasesPendientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
