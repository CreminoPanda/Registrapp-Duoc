import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearSeccionPage } from './crear-seccion.page';

const routes: Routes = [
  {
    path: '',
    component: CrearSeccionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearSeccionPageRoutingModule {}
