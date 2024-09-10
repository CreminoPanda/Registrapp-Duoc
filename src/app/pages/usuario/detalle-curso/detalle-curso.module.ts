import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleCursoPageRoutingModule } from './detalle-curso-routing.module';

import { DetalleCursoPage } from './detalle-curso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCursoPageRoutingModule
  ],
  declarations: [DetalleCursoPage]
})
export class DetalleCursoPageModule {}
