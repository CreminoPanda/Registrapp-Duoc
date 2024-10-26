import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';

@Component({
  selector: 'app-escanear-qr',
  templateUrl: './escanear-qr.page.html',
  styleUrls: ['./escanear-qr.page.scss'],
})
export class EscanearQrPage implements OnInit {

  qrValue = '';
  resultadoQR = '';
  constructor(
    private authServices: AuthService,
    private modalController: ModalController,
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }

    this.authServices.isLogged().subscribe(user => {
      this.qrValue = user.uid;
    });
  }


  async openCamera() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanner-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        LensFacing: LensFacing.Back
      }
    });

    await modal.present();


    const { data } = await modal.onDidDismiss();


    if (data?.barcode?.displayValue) {

      this.resultadoQR = data.barcode.displayValue;

      setTimeout(() => {
        this.router.navigate(['/invitado', this.resultadoQR]);
      }, 1000);
    }
  }
}