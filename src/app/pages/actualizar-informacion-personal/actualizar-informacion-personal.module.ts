import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarInformacionPersonalPageRoutingModule } from './actualizar-informacion-personal-routing.module';

import { ActualizarInformacionPersonalPage } from './actualizar-informacion-personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ActualizarInformacionPersonalPageRoutingModule,
  ],
  declarations: [ActualizarInformacionPersonalPage],
})
export class ActualizarInformacionPersonalPageModule {}
