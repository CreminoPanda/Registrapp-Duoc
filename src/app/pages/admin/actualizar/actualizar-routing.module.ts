import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActualizarPage } from './actualizar.page';


const routes: Routes = [
  {
    path: '',
    component: ActualizarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule,
    ReactiveFormsModule],
  exports: [RouterModule],
})
export class ActualizarPageRoutingModule {}
