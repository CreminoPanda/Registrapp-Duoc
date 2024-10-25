import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarAsignaturasPage } from './listar-asignaturas.page';

const routes: Routes = [
  {
    path: '',
    component: ListarAsignaturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarAsignaturasPageRoutingModule {}
