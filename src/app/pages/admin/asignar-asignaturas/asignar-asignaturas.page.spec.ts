import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignarAsignaturasPage } from './asignar-asignaturas.page';

describe('AsignarAsignaturasPage', () => {
  let component: AsignarAsignaturasPage;
  let fixture: ComponentFixture<AsignarAsignaturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarAsignaturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
