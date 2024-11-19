import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanqrPageRoutingModule } from './scanqr-routing.module';

import { ScanQrPage } from './scanqr.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ScanqrPageRoutingModule],
  declarations: [ScanQrPage],
})
export class ScanqrPageModule {}
