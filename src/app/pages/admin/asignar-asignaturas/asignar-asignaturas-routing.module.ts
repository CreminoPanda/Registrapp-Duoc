import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignarAsignaturasPage } from './asignar-asignaturas.page';

const routes: Routes = [
  {
    path: '',
    component: AsignarAsignaturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignarAsignaturasPageRoutingModule {}