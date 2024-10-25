import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarAsignaturasPageRoutingModule } from './listar-asignaturas-routing.module';

import { ListarAsignaturasPage } from './listar-asignaturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarAsignaturasPageRoutingModule
  ],
  declarations: [ListarAsignaturasPage]
})
export class ListarAsignaturasPageModule {}
