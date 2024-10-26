import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerSeccionesPage } from './ver-secciones.page';

const routes: Routes = [
  {
    path: '',
    component: VerSeccionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerSeccionesPageRoutingModule {}
