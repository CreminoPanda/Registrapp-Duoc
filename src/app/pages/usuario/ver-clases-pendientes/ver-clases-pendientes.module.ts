import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerClasesPendientesPageRoutingModule } from './ver-clases-pendientes-routing.module';

import { VerClasesPendientesPage } from './ver-clases-pendientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerClasesPendientesPageRoutingModule
  ],
  declarations: [VerClasesPendientesPage]
})
export class VerClasesPendientesPageModule {}
