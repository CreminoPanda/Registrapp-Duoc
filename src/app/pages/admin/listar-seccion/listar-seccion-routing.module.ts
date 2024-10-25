import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarSeccionPage } from './listar-seccion.page';

const routes: Routes = [
  {
    path: '',
    component: ListarSeccionPage
  },
  {
    path: ':asignaturaUid',
    component: ListarSeccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarSeccionPageRoutingModule {}