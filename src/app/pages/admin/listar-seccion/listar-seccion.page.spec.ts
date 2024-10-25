import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarSeccionPage } from './listar-seccion.page';

describe('ListarSeccionPage', () => {
  let component: ListarSeccionPage;
  let fixture: ComponentFixture<ListarSeccionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarSeccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
