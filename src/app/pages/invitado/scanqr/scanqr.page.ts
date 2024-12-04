import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import Swal from 'sweetalert2';
import { AsignaturaService } from 'src/app/services/asignatura.service';

@Component({
  selector: 'app-scanqr',
  templateUrl: './scanqr.page.html',
  styleUrls: ['./scanqr.page.scss'],
})
export class ScanQrPage implements OnInit {
  seccionUid: string = '';
  alumnoUid: string = '';
  asistenciaUid: string = ''; // UID de la asistencia actual
  profesor: any = {};
  seccion: any = {};

  constructor(
    private route: ActivatedRoute,
    private asignaturaService: AsignaturaService
  ) {}

  ngOnInit() {
    this.seccionUid = this.route.snapshot.paramMap.get('seccionUid') || '';
    this.alumnoUid = this.route.snapshot.paramMap.get('alumnoUid') || '';
    this.cargarDatosSeccion();
    this.obtenerAsistenciaUid();
  }

  cargarDatosSeccion() {
    this.asignaturaService
      .obtenerSecciones(this.seccionUid)
      .then((data: any) => {
        this.profesor = data.profesor;
        this.seccion = data.seccion;
      })
      .catch(async (error: any) => {
        await Swal.fire({
          title: 'Error',
          text: 'No se ha podido descargar el modulo',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false,
        });
        console.error('Error al cargar los datos de la sección:', error);
      });
  }

  obtenerAsistenciaUid() {
    this.asignaturaService
      .obtenerAsistenciaPorSeccion(this.seccionUid)
      .then((asistencia: any) => {
        this.asistenciaUid = asistencia.uid;
      })
      .catch((error: any) => {
        console.error('Error al obtener el UID de la asistencia:', error);
      });
  }

  async confirmarAsistencia() {
    if (!this.seccionUid || !this.alumnoUid || !this.asistenciaUid) {
      await Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      return;
    }

    this.asignaturaService
      .obtenerAlumnosPorSeccion(this.seccionUid)
      .then((alumnos: any[]) => {
        const alumno = alumnos.find((a) => a.uid === this.alumnoUid);
        if (alumno) {
          this.asignaturaService
            .marcarAsistencia(this.asistenciaUid, this.alumnoUid, true)
            .then(async () => {
              await Swal.fire({
                title: 'Asistencia confirmada',
                text: 'Has sido marcado como presente',
                icon: 'success',
                confirmButtonText: 'OK',
                heightAuto: false,
              });
            })
            .catch(async (error: any) => {
              await Swal.fire({
                title: 'Error',
                text: 'Error al marcar la asistencia',
                icon: 'error',
                confirmButtonText: 'OK',
                heightAuto: false,
              });
              console.error('Error al marcar la asistencia:', error);
            });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No estás registrado en esta sección',
            icon: 'error',
            confirmButtonText: 'OK',
            heightAuto: false,
          });
        }
      })
      .catch(async (error: any) => {
        await Swal.fire({
          title: 'Error',
          text: 'Error al obtener los alumnos de la sección',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false,
        });
        console.error('Error al obtener los alumnos de la sección:', error);
      });
  }

  async scan() {
    try {
      const granted = await this.requestPermissions();
      if (!granted) {
        await Swal.fire({
          title: 'Permiso Denegado',
          text: 'Por favor, conceda permiso a la cámara para utilizar el escáner de Barcode',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false,
        });
        return;
      }

      const { barcodes } = await BarcodeScanner.scan();
      const qrContent = barcodes[0].rawValue;
      const qrData = JSON.parse(qrContent);
      this.seccionUid = qrData.seccionUid;
      this.obtenerAsistenciaUid();
      this.cargarDetalleSeccion();

      await Swal.fire({
        title: 'Escaneo exitoso',
        text: 'El código QR ha sido escaneado correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: 'Error al escanear el código QR',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      console.error('Error al escanear el código QR:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  cargarDetalleSeccion() {
    this.asignaturaService
      .obtenerDetalleSeccion(this.seccionUid)
      .then((detalle: any) => {
        this.seccion = detalle.seccion;
        this.profesor = detalle.profesor;
      });
  }

  async marcarPresente() {
    if (!this.asistenciaUid) {
      await Swal.fire({
        title: 'Error',
        text: 'No se ha encontrado la asistencia actual.',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      return;
    }

    try {
      await this.asignaturaService.marcarAsistencia(
        this.asistenciaUid,
        this.alumnoUid,
        true
      );
      await Swal.fire({
        title: 'Presente',
        text: 'Has sido marcado como presente',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: 'Error al marcar como presente',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      console.error('Error al marcar como presente:', error);
    }
  }
}
