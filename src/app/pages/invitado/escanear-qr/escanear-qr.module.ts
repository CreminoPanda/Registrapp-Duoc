import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EscanearQrPageRoutingModule } from './escanear-qr-routing.module';
import { EscanearQrPage } from './escanear-qr.page';
import { QrCodeModule } from 'ng-qrcode';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscanearQrPageRoutingModule,
    QrCodeModule
  ],
  declarations: [EscanearQrPage, BarcodeScanningModalComponent]
})
export class EscanearQrPageModule {}