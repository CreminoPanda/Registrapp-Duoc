import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Asistencia } from 'src/app/interfaces/asistencia';
import { Alumno } from 'src/app/interfaces/alumno';
import Swal from 'sweetalert2';
import * as QRCode from 'qrcode';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage implements OnInit {
  asignaturaUid: string = '';
  seccionUid: string = '';
  qrCodeUrl: string = '';
  alumnos: Alumno[] = [];
  claseEnCurso: boolean = false;
  asistenciaUid: string = '';

  constructor(
    private route: ActivatedRoute,
    private asistenciaService: AsistenciaService,
    private mensajes: MensajesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.asignaturaUid = params.get('asignaturaUid') || '';
      this.seccionUid = params.get('seccionUid') || '';
      this.obtenerAlumnos();
    });
  }

  async obtenerAlumnos() {
    this.alumnos =
      (await this.asistenciaService
        .obtenerAlumnosPorSeccion(this.seccionUid)
        .toPromise()) || [];
  }

  async iniciarClase() {
    const asistencia: Asistencia = {
      uid: '',
      asignaturaUid: this.asignaturaUid,
      seccionUid: this.seccionUid,
      fecha: new Date(),
      estudiantes: {},
    };

    try {
      this.alumnos.forEach((alumno) => {
        asistencia.estudiantes[alumno.correo] = false;
      });

      this.asistenciaUid = this.asistenciaService.createId();
      asistencia.uid = this.asistenciaUid;
      const qrData = JSON.stringify(asistencia);
      this.qrCodeUrl = await QRCode.toDataURL(qrData);
      this.claseEnCurso = true;
      this.mensajes.mensaje(
        'Clase iniciada y código QR generado correctamente',
        'success',
        'Éxito'
      );
    } catch (error) {
      this.mensajes.mensaje('No se pudo iniciar la clase', 'error', 'Error');
    }
  }

  async finalizarClase() {
    try {
      console.log('Obteniendo asistencia con UID:', this.asistenciaUid);
      const asistencia = await this.asistenciaService
        .obtenerAsistencia(this.asistenciaUid)
        .toPromise();
      if (!asistencia) {
        throw new Error('Asistencia no encontrada');
      }
      console.log('Asistencia obtenida:', asistencia);

      const alumnosPresentes = Object.values(asistencia.estudiantes).filter(
        (presente) => presente
      ).length;
      console.log('Alumnos presentes:', alumnosPresentes);

      await this.asistenciaService.guardarClaseFinalizada({
        fecha: asistencia.fecha,
        alumnosPresentes,
        seccionUid: this.seccionUid,
        asignaturaUid: this.asignaturaUid,
      });
      console.log('Clase finalizada guardada en la base de datos');

      this.claseEnCurso = false;
      this.qrCodeUrl = '';
      this.mensajes.mensaje(
        'La clase fue finalizada correctamente',
        'success',
        'Clase Finalizada'
      );
    } catch (error) {
      this.mensajes.mensaje('No se pudo finalizar la clase', 'error', 'Error');
      console.error('Error al finalizar la clase:', error);
    }
  }
}
