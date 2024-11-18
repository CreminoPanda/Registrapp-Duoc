import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { AuthService } from 'src/app/services/firebase/auth.service'; // Asegúrate de tener un servicio de autenticación
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { AlumnosService } from 'src/app/services/alumnos.service'; // Servicio para obtener datos del alumno
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-escanear-qr',
  templateUrl: './escanear-qr.page.html',
  styleUrls: ['./escanear-qr.page.scss'],
})
export class EscanearQrPage {
  resultadoQR: string = '';
  qrValue: string = ''; // Agrega esta propiedad
  alumnoNombre: string = ''; // Propiedad para mostrar el nombre del alumno
  alumnoApellido: string = ''; // Propiedad para mostrar el apellido del alumno

  constructor(
    private modalController: ModalController,
    private router: Router,
    private asistenciaService: AsistenciaService,
    private mensajes: MensajesService,
    private authService: AuthService, // Inyecta el servicio de autenticación
    private alumnosService: AlumnosService // Inyecta el servicio de alumnos
  ) {}

  async openCamera() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanner-modal',
      showBackdrop: false,
      componentProps: {
        formats: [BarcodeFormat.QR_CODE], // Asegúrate de incluir QR_CODE
        LensFacing: 'back', // Asegúrate de que la cámara trasera esté seleccionada
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.barcode?.displayValue) {
      this.resultadoQR = data.barcode.displayValue;

      try {
        const asistencia = JSON.parse(this.resultadoQR);
        this.authService.isLogged().subscribe(async (alumnoUid) => {
          if (alumnoUid) {
            asistencia.estudiantes[alumnoUid] = true;
            await this.asistenciaService.actualizarAsistencia(asistencia);
            const alumno = await this.alumnosService
              .getAlumnoByUid(alumnoUid)
              .toPromise();
            if (alumno) {
              this.alumnoNombre = alumno.nombre;
              this.alumnoApellido = alumno.apellido;
              this.mensajes.mensaje(
                `Asistencia marcada correctamente para ${this.alumnoNombre} ${this.alumnoApellido}`,
                'success',
                'Éxito'
              );
            }
          } else {
            this.mensajes.mensaje(
              'Alumno no encontrado en la lista de asistencia',
              'error',
              'Error'
            );
          }
        });
      } catch (error) {
        this.mensajes.mensaje(
          'Error al procesar el código QR',
          'error',
          'Error'
        );
        console.error('Error al procesar el código QR:', error);
      }

      setTimeout(() => {
        this.router.navigate(['/invitado-dashboard', this.resultadoQR]);
      }, 1000);
    }
  }
}
