import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Seccion } from 'src/app/interfaces/seccion';
import { Alumno } from '../interfaces/alumno';
import { MensajesService } from './mensajes.service';

@Injectable({
  providedIn: 'root',
})
export class AsignaturaService {
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private mensajes: MensajesService
  ) {}

  async crearAsignatura(nombre: string) {
    const uid = this.firestore.createId();
    const asignatura: Asignatura = { uid, nombre };

    try {
      await this.firestore.collection('asignaturas').doc(uid).set(asignatura);
      this.mensajes
        .mensaje('Asignatura creada correctamente', 'success', 'Exito')
        .then(() => {
          this.router.navigate(['/admin-dashboard']);
        });
    } catch (error) {
      this.mensajes.mensaje('No se pudo crear la asignatura', 'error', 'Error');
    }
  }

  async crearSeccion(asignaturaUid: string, cupos: number) {
    try {
      const seccionesSnapshot = await this.firestore
        .collection<Seccion>('secciones', (ref) =>
          ref.where('asignaturaUid', '==', asignaturaUid)
        )
        .get()
        .toPromise();

      if (!seccionesSnapshot) {
        throw new Error('No se pudieron obtener las secciones existentes');
      }

      const secciones = seccionesSnapshot.docs.map((doc) => doc.data());

      const maxNumero = secciones.reduce(
        (max, seccion) => (seccion.numero > max ? seccion.numero : max),
        0
      );
      const nuevoNumero = maxNumero + 1;

      const seccionUid = this.firestore.createId();
      const seccion: Seccion = {
        numero: nuevoNumero,
        seccionUid,
        asignaturaUid,
        cupos,
      };

      await this.firestore.collection('secciones').doc(seccionUid).set(seccion);
      this.mensajes.mensaje('Sección creada correctamente', 'success', 'Exito');
    } catch (error) {
      this.mensajes.mensaje('No se pudo crear la sección', 'error', 'Error');
    }
  }

  listarSeccionesPorAsignatura(asignaturaUid: string) {
    return this.firestore
      .collection<Seccion>('secciones', (ref) =>
        ref.where('asignaturaUid', '==', asignaturaUid)
      )
      .valueChanges();
  }

  getAsignaturas(): Observable<Asignatura[]> {
    return this.firestore
      .collection('asignaturas')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Asignatura;
            data.uid = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  getSecciones(): Observable<Seccion[]> {
    return this.firestore
      .collection<Seccion>('secciones')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Seccion;
            data.seccionUid = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  async asignarAsignaturasAProfesor(
    profesorUid: string,
    asignaturaUids: string[]
  ) {
    const batch = this.firestore.firestore.batch();

    try {
      const profesorRef = this.firestore
        .collection('profesores')
        .doc(profesorUid).ref;

      for (const asignaturaUid of asignaturaUids) {
        const asignaturaRef = this.firestore
          .collection('asignaturas')
          .doc(asignaturaUid).ref;
        const asignaturaSnapshot = await asignaturaRef.get();
        const asignaturaData = asignaturaSnapshot.data() as Asignatura;

        // Actualizar la asignatura con el profesorUid
        batch.update(asignaturaRef, { profesorUid });

        // Añadir la asignatura a la subcolección del profesor
        batch.set(profesorRef.collection('asignaturas').doc(asignaturaUid), {
          uid: asignaturaUid,
          nombre: asignaturaData.nombre,
        });

        // Añadir las secciones de la asignatura a la subcolección del profesor
        const seccionesSnapshot = await this.firestore
          .collection('secciones', (ref) =>
            ref.where('asignaturaUid', '==', asignaturaUid)
          )
          .get()
          .toPromise();
        if (seccionesSnapshot && !seccionesSnapshot.empty) {
          seccionesSnapshot.forEach((doc) => {
            const seccionData = doc.data() as Seccion;
            seccionData.seccionUid = doc.id;
            batch.set(
              profesorRef
                .collection('asignaturas')
                .doc(asignaturaUid)
                .collection('secciones')
                .doc(seccionData.seccionUid),
              seccionData
            );
          });
        }
      }

      await batch.commit();
      this.mensajes.mensaje(
        'Asignaturas asignadas correctamente',
        'success',
        'Éxito'
      );
    } catch (error) {
      this.mensajes.mensaje(
        'No se pudo asignar las asignaturas',
        'error',
        'Error'
      );
    }
  }

  async asignarSeccionesAProfesor(profesorUid: string, seccionUids: string[]) {
    const batch = this.firestore.firestore.batch();

    try {
      const profesorRef = this.firestore
        .collection('profesores')
        .doc(profesorUid).ref;

      for (const seccionUid of seccionUids) {
        const seccionRef = this.firestore
          .collection('secciones')
          .doc(seccionUid).ref;
        const seccionSnapshot = await seccionRef.get();
        const seccionData = seccionSnapshot.data() as Seccion;

        // Añadir la sección a la subcolección del profesor
        batch.set(
          profesorRef.collection('secciones').doc(seccionUid),
          seccionData
        );
      }

      await batch.commit();
      this.mensajes.mensaje(
        'Secciones asignadas correctamente',
        'success',
        'Éxito'
      );
    } catch (error) {
      this.mensajes.mensaje(
        'No se pudo asignar las secciones',
        'error',
        'Error'
      );
    }
  }

  listarAsignaturasPorProfesor(profesorUid: string): Observable<Asignatura[]> {
    return this.firestore
      .collection(`profesores/${profesorUid}/asignaturas`)
      .valueChanges() as Observable<Asignatura[]>;
  }

  listarSeccionesPorProfesor(profesorUid: string): Observable<Seccion[]> {
    return this.firestore
      .collection(`profesores/${profesorUid}/secciones`)
      .valueChanges() as Observable<Seccion[]>;
  }

  async asignarAlumnosASeccion(seccionUid: string, alumnoUids: string[]) {
    const batch = this.firestore.firestore.batch();

    try {
      const seccionRef = this.firestore
        .collection('secciones')
        .doc(seccionUid).ref;

      for (const alumnoUid of alumnoUids) {
        const alumnoRef = this.firestore
          .collection('alumnos')
          .doc(alumnoUid).ref;
        const alumnoSnapshot = await alumnoRef.get();
        const alumnoData = alumnoSnapshot.data() as Alumno;

        // Añadir el alumno a la subcolección de la sección
        batch.set(seccionRef.collection('alumnos').doc(alumnoUid), alumnoData);
      }

      await batch.commit();
      this.mensajes.mensaje(
        'Alumnos asignados correctamente',
        'success',
        'Éxito'
      );
    } catch (error) {
      this.mensajes.mensaje('No se pudo asignar los alumnos', 'error', 'Error');
    }
  }
}
