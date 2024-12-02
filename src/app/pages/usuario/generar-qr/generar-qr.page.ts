import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import * as qrcode from 'qrcode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage implements OnInit {
  seccionUid: string = '';
  alumnos: any[] = [];
  qrCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private asignaturaService: AsignaturaService
  ) {}

  ngOnInit() {
    this.seccionUid = this.route.snapshot.paramMap.get('seccionUid') || '';
    this.cargarAlumnos();
  }

  cargarAlumnos() {
    this.asignaturaService
      .obtenerAlumnosPorSeccion(this.seccionUid)
      .then((alumnos: any[]) => {
        this.alumnos = alumnos.map((alumno) => ({
          ...alumno,
          presente: false, // Por defecto, todos los alumnos están ausentes
        }));
      });
  }

  marcarAsistencia(alumno: any) {
    this.asignaturaService
      .marcarAsistencia(this.seccionUid, alumno.uid, alumno.presente)
      .then(() => {
        console.log(
          `Asistencia de ${alumno.nombre} actualizada a ${alumno.presente}`
        );
      })
      .catch((error) => {
        console.error('Error al marcar asistencia:', error);
      });
  }

  async generarQR() {
    const qrData = { seccionUid: this.seccionUid };
    const qrContent = JSON.stringify(qrData);
    try {
      this.qrCode = await qrcode.toDataURL(qrContent);
    } catch (err) {
      console.error('Error al generar el QR:', err);
    }
  }

  finalizarClase() {
    this.asignaturaService
      .finalizarClase(this.seccionUid)
      .then(() => {
        Swal.fire({
          title: 'Clase finalizada',
          text: 'La asistencia ha sido guardada exitosamente',
          icon: 'success',
        });
      })
      .catch((error: any) => {
        Swal.fire({
          title: 'Error',
          text: 'Error al finalizar la clase',
          icon: 'error',
        });
        console.error('Error al finalizar la clase:', error);
      });
  }
}
