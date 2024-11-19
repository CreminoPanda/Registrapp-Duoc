import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanqrPage } from './scanqr.page';

describe('ScanqrPage', () => {
  let component: ScanqrPage;
  let fixture: ComponentFixture<ScanqrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
