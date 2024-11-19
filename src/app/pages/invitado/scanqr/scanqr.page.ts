import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scanqr.page.html',
  styleUrls: ['./scanqr.page.scss'],
})
export class ScanQrPage {
  constructor(private navCtrl: NavController) {}

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    await this.requestGoogle();
    if (!granted) {
      Swal.fire({
        title: 'Permiso Denegado',
        text: 'Por favor, conceda permiso a la cámara para utilizar el escáner de Barcode',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    const qrContent = barcodes[0].rawValue;
    const qrData = JSON.parse(qrContent);
    this.navCtrl.navigateForward('/confirmar-asistencia', {
      queryParams: { url: qrContent },
    });
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async requestGoogle(): Promise<boolean> {
    const { available } =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    if (!available) {
      Swal.fire({
        title: 'Error',
        text: 'Se debe descargar el modulo',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      await this.instalarModulo();
    }
    return available;
  }

  async instalarModulo(): Promise<void> {
    try {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
      Swal.fire({
        title: 'Éxito',
        text: 'Se ha descargado el modulo necesario',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se ha podido descargar el modulo',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
}
