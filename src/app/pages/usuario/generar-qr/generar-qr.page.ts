import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
  asistenciaUid: string = ''; // UID de la asistencia actual

  constructor(
    private route: ActivatedRoute,
    private asignaturaService: AsignaturaService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.seccionUid = this.route.snapshot.paramMap.get('seccionUid') || '';
    this.cargarAlumnos();
    this.suscribirseCambiosAsistencia();
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

  suscribirseCambiosAsistencia() {
    this.firestore
      .collection('asistencias', (ref) =>
        ref.where('seccionUid', '==', this.seccionUid)
      )
      .valueChanges()
      .subscribe((asistencias: any[]) => {
        if (asistencias.length > 0) {
          const asistencia = asistencias[0];
          this.alumnos = Object.keys(asistencia.alumnos).map((uid) => ({
            uid,
            ...asistencia.alumnos[uid],
          }));
        }
      });
  }

  marcarAsistencia(alumno: any) {
    this.asignaturaService
      .marcarAsistencia(this.asistenciaUid, alumno.uid, alumno.presente)
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
      this.guardarAsistencia(); // Guardar la asistencia al generar el QR
    } catch (err) {
      console.error('Error al generar el QR:', err);
    }
  }

  guardarAsistencia() {
    const asistencia = {
      fecha: new Date(),
      seccionUid: this.seccionUid,
      alumnos: this.alumnos.reduce((acc, alumno) => {
        acc[alumno.uid] = {
          nombre: alumno.nombre,
          apellido: alumno.apellido,
          rut: alumno.rut,
          presente: alumno.presente,
        };
        return acc;
      }, {}),
    };
    this.asignaturaService
      .guardarAsistencia(asistencia)
      .then((docRef) => {
        this.asistenciaUid = docRef.id; // Guardar el UID de la asistencia
        console.log('Asistencia guardada exitosamente');
      })
      .catch((error) => {
        console.error('Error al guardar la asistencia:', error);
      });
  }

  async actualizarAsistencia() {
    this.alumnos.forEach((alumno) => {
      this.marcarAsistencia(alumno);
    });
    await Swal.fire({
      title: 'Asistencia actualizada',
      text: 'La asistencia ha sido actualizada exitosamente',
      icon: 'success',
      confirmButtonText: 'OK',
      heightAuto: false,
    });
  }

  async finalizarClase() {
    try {
      await this.asignaturaService.finalizarClase(this.seccionUid);
      await Swal.fire({
        title: 'Clase finalizada',
        text: 'La asistencia ha sido guardada exitosamente',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: 'Error al finalizar la clase',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      console.error('Error al finalizar la clase:', error);
    }
  }
}
