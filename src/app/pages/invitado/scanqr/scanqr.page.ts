import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scanqr.page.html',
  styleUrls: ['./scanqr.page.scss'],
})
export class ScanQrPage implements OnInit {
  seccion: any = {};
  profesor: any = {};
  seccionUid: string = '';
  alumnoUid: string = '';

  constructor(
    private navCtrl: NavController,
    private asignaturaService: AsignaturaService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isLogged().subscribe((uid) => {
      this.alumnoUid = uid;
    });
  }

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
    this.seccionUid = qrData.seccionUid;
    this.cargarDetalleSeccion();
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

  cargarDetalleSeccion() {
    this.asignaturaService
      .obtenerDetalleSeccion(this.seccionUid)
      .then((detalle) => {
        this.seccion = detalle.seccion;
        this.profesor = detalle.profesor;
      });
  }

  marcarPresente() {
    this.asignaturaService
      .obtenerAlumnosPorSeccion(this.seccionUid)
      .then((alumnos) => {
        const alumno = alumnos.find((a) => a.uid === this.alumnoUid);
        if (alumno) {
          Swal.fire({
            title: 'Asistencia confirmada',
            text: 'Has sido marcado como presente',
            icon: 'success',
          });
          this.asignaturaService.marcarAsistencia(
            this.seccionUid,
            this.alumnoUid,
            true
          );
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No perteneces a esta sección',
            icon: 'error',
          });
        }
      });
  }
}
