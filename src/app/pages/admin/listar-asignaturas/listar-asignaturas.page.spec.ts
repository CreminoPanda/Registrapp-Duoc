import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarAsignaturasPage } from './listar-asignaturas.page';

describe('ListarAsignaturasPage', () => {
  let component: ListarAsignaturasPage;
  let fixture: ComponentFixture<ListarAsignaturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAsignaturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
