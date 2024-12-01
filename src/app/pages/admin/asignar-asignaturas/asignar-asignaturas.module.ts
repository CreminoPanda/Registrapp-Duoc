import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AsignarAsignaturasPageRoutingModule } from './asignar-asignaturas-routing.module';
import { AsignarAsignaturasPage } from './asignar-asignaturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignarAsignaturasPageRoutingModule,
  ],
  declarations: [AsignarAsignaturasPage],
})
export class AsignarAsignaturasPageModule {}
