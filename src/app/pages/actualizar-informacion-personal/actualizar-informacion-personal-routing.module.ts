import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarInformacionPersonalPage } from './actualizar-informacion-personal.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarInformacionPersonalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarInformacionPersonalPageRoutingModule {}
