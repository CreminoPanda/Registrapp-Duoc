import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VerSeccionesPageRoutingModule } from './ver-secciones-routing.module';
import { VerSeccionesPage } from './ver-secciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerSeccionesPageRoutingModule,
  ],
  declarations: [VerSeccionesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VerSeccionesPageModule {}
