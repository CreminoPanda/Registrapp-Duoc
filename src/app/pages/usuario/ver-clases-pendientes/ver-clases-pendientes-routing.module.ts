import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerClasesPendientesPage } from './ver-clases-pendientes.page';

const routes: Routes = [
  {
    path: '',
    component: VerClasesPendientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerClasesPendientesPageRoutingModule {}
