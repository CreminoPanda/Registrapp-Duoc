import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarPageRoutingModule } from './actualizar-routing.module';

import { ActualizarPage } from './actualizar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualizarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ActualizarPage]
})
export class ActualizarPageModule {}
