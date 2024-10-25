import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarSeccionPageRoutingModule } from './listar-seccion-routing.module';

import { ListarSeccionPage } from './listar-seccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarSeccionPageRoutingModule
  ],
  declarations: [ListarSeccionPage]
})
export class ListarSeccionPageModule {}
