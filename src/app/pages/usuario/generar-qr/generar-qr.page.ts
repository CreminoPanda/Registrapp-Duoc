import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';
import * as qrcode from 'qrcode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage implements OnInit, OnDestroy {
  seccionUid: string = '';
  alumnos: any[] = [];
  qrCode: string = '';
  asistenciaUid: string = ''; // UID de la asistencia actual
  asistenciaSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private asignaturaService: AsignaturaService,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.seccionUid = this.route.snapshot.paramMap.get('seccionUid') || '';
    this.asistenciaUid =
      this.route.snapshot.paramMap.get('asistenciaUid') || '';
    if (!this.asistenciaUid) {
      console.error('asistenciaUid is undefined');
    }
    this.cargarAlumnos();
    this.recuperarEstadoAsistencia();
    this.suscribirseCambiosAsistencia();
  }

  ngOnDestroy() {
    if (this.asistenciaSubscription) {
      this.asistenciaSubscription.unsubscribe();
    }
  }

  cargarAlumnos() {
    this.asignaturaService
      .obtenerAlumnosPorSeccion(this.seccionUid)
      .then((alumnos: any[]) => {
        // Mantener el estado de los alumnos si ya ha sido establecido
        this.alumnos = alumnos.map((alumno) => {
          const alumnoExistente = this.alumnos.find(
            (a) => a.uid === alumno.uid
          );
          return {
            ...alumno,
            presente: alumnoExistente
              ? alumnoExistente.presente
              : alumno.presente || false,
          };
        });
      });
  }

  suscribirseCambiosAsistencia() {
    this.asistenciaSubscription = this.firestore
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

  async generarQR() {
    const qrData = {
      seccionUid: this.seccionUid,
      asistenciaUid: this.asistenciaUid,
    };
    const qrContent = JSON.stringify(qrData);
    try {
      this.qrCode = await qrcode.toDataURL(qrContent);
      this.guardarAsistencia(this.qrCode); // Guardar la asistencia al generar el QR
    } catch (err) {
      console.error('Error al generar el QR:', err);
    }
  }

  guardarAsistencia(qrCode: string) {
    const asistencia = {
      fecha: new Date(),
      seccionUid: this.seccionUid,
      terminado: false, // Clase no terminada por defecto
      qrCode: qrCode, // Guardar el QR generado
      alumnos: this.alumnos.reduce((acc, alumno) => {
        acc[alumno.uid] = {
          uid: alumno.uid,
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
        // Actualizar el documento de asistencia con el UID
        this.firestore
          .collection('asistencias')
          .doc(this.asistenciaUid)
          .update({ uid: this.asistenciaUid })
          .catch((error) => {
            console.error(
              'Error al actualizar el UID de la asistencia:',
              error
            );
          });
      })
      .catch((error) => {
        console.error('Error al guardar la asistencia:', error);
      });
  }

  async actualizarAsistencia() {
    const presentes = this.alumnos.filter((alumno) => alumno.presente);
    const ausentes = this.alumnos.filter((alumno) => !alumno.presente);

    await Swal.fire({
      title: 'Asistencia actualizada',
      html: `<p>Presentes: ${presentes.length}</p><p>Ausentes: ${ausentes.length}</p>`,
      icon: 'success',
      confirmButtonText: 'OK',
      heightAuto: false,
    });
  }

  marcarAsistencia(alumno: any) {
    this.asignaturaService
      .marcarAsistencia(this.asistenciaUid, alumno.uid, alumno.presente)
      .catch((error) => {
        console.error('Error al marcar asistencia:', error);
      });
  }

  async finalizarClase() {
    try {
      await this.asignaturaService.finalizarClase(this.seccionUid);
      await this.firestore
        .collection('asistencias')
        .doc(this.asistenciaUid)
        .update({ terminado: true }); // Actualizar el estado de terminado a true
      await Swal.fire({
        title: 'Clase finalizada',
        text: 'La asistencia ha sido guardada exitosamente',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      this.router.navigate(['/invitado-profesor']); // Redirigir a la página de invitado-profesor
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

  recuperarEstadoAsistencia() {
    this.firestore
      .collection('asistencias', (ref) =>
        ref
          .where('seccionUid', '==', this.seccionUid)
          .where('uid', '==', this.asistenciaUid)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot && !querySnapshot.empty) {
          const asistenciaDoc = querySnapshot.docs[0];
          const asistencia = asistenciaDoc.data() as any;
          this.asistenciaUid = asistenciaDoc.id;
          this.qrCode = asistencia.qrCode; // Recuperar el QR generado

          this.alumnos = Object.keys(asistencia.alumnos).map((uid) => ({
            uid,
            ...asistencia.alumnos[uid],
          }));

          // Verificar el estado de cada alumno
          this.alumnos.forEach((alumno) => {
            console.log(`Estado del alumno ${alumno.uid}:`, alumno.presente);
          });

          if (asistencia.terminado) {
            Swal.fire({
              title: 'Clase finalizada',
              text: 'La clase ya ha sido finalizada.',
              icon: 'info',
              confirmButtonText: 'OK',
              heightAuto: false,
            });
          } else {
            console.log('Estado de asistencia recuperado exitosamente');
          }
        }
      })
      .catch((error) => {
        console.error('Error al recuperar el estado de la asistencia:', error);
      });
  }
}
