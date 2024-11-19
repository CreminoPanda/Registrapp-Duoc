import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmarAsistenciaPageRoutingModule } from './confirmar-asistencia-routing.module';

import { ConfirmarAsistenciaPage } from './confirmar-asistencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmarAsistenciaPageRoutingModule
  ],
  declarations: [ConfirmarAsistenciaPage]
})
export class ConfirmarAsistenciaPageModule {}
