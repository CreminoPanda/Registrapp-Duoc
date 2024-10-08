import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OlvideContraPageRoutingModule } from './olvide-contra-routing.module';

import { OlvideContraPage } from './olvide-contra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OlvideContraPageRoutingModule
  ],
  declarations: [OlvideContraPage]
})
export class OlvideContraPageModule {}