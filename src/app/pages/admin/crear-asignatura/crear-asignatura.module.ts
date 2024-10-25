import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CrearAsignaturaPageRoutingModule } from './crear-asignatura-routing.module';

import { CrearAsignaturaPage } from './crear-asignatura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearAsignaturaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearAsignaturaPage]
})
export class CrearAsignaturaPageModule {}
