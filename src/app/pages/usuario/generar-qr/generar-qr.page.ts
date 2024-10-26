import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Asistencia } from 'src/app/interfaces/asistencia';
import { Alumno } from 'src/app/interfaces/alumno';
import Swal from 'sweetalert2';
import * as QRCode from 'qrcode';

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
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.asignaturaUid = params.get('asignaturaUid') || '';
      this.seccionUid = params.get('seccionUid') || '';
      this.obtenerAlumnos();
    });
  }

  async obtenerAlumnos() {
    this.alumnos = (await this.asistenciaService.obtenerAlumnosPorSeccion(this.seccionUid).toPromise()) || [];
  }

  async iniciarClase() {
    const asistencia: Asistencia = {
      uid: '',
      asignaturaUid: this.asignaturaUid,
      seccionUid: this.seccionUid,
      fecha: new Date(),
      estudiantes: {}
    };
  
    try {
      this.alumnos.forEach(alumno => {
        asistencia.estudiantes[alumno.correo] = false;
      });
  
      this.asistenciaUid = this.asistenciaService.createId();
      asistencia.uid = this.asistenciaUid;
      const qrData = JSON.stringify(asistencia);
      this.qrCodeUrl = await QRCode.toDataURL(qrData);
      this.claseEnCurso = true;
      Swal.fire({
        title: 'Éxito!',
        text: 'Clase iniciada y QR Code generado correctamente!',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo iniciar la clase!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }

  async finalizarClase() {
    try {
      console.log('Obteniendo asistencia con UID:', this.asistenciaUid);
      const asistencia = await this.asistenciaService.obtenerAsistencia(this.asistenciaUid).toPromise();
      if (!asistencia) {
        throw new Error('Asistencia no encontrada');
      }
      console.log('Asistencia obtenida:', asistencia);
  
      const alumnosPresentes = Object.values(asistencia.estudiantes).filter(presente => presente).length;
      console.log('Alumnos presentes:', alumnosPresentes);
  
      await this.asistenciaService.guardarClaseFinalizada({
        fecha: asistencia.fecha,
        alumnosPresentes,
        seccionUid: this.seccionUid,
        asignaturaUid: this.asignaturaUid
      });
      console.log('Clase finalizada guardada en la base de datos');
  
      this.claseEnCurso = false;
      this.qrCodeUrl = ''; 
      Swal.fire({
        title: 'Clase Finalizada!',
        text: 'La clase ha sido finalizada correctamente.',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    } catch (error) {
      console.error('Error al finalizar la clase:', error);
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo finalizar la clase!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }


}