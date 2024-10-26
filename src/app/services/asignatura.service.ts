import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Asignatura } from 'src/app/interfaces/asignatura'; 
import { Seccion } from 'src/app/interfaces/seccion';
import { Alumno } from '../interfaces/alumno';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  constructor(private firestore: AngularFirestore, private router:Router) { }

  async crearAsignatura(nombre: string) {
    const uid = this.firestore.createId();
    const asignatura: Asignatura = { uid, nombre };

    try {
      await this.firestore.collection('asignaturas').doc(uid).set(asignatura);
      Swal.fire({
        title: 'Éxito!',
        text: 'Asignatura creada correctamente!',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      }).then(() => {
        this.router.navigate(['/admin-dashboard']);
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se puede crear la asignatura!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }

  async crearSeccion(asignaturaUid: string, cupos: number) {
    try {
      const seccionesSnapshot = await this.firestore.collection<Seccion>('secciones', ref => ref.where('asignaturaUid', '==', asignaturaUid)).get().toPromise();
      
      if (!seccionesSnapshot) {
        throw new Error('No se pudieron obtener las secciones existentes');
      }

      const secciones = seccionesSnapshot.docs.map(doc => doc.data());

      const maxNumero = secciones.reduce((max, seccion) => seccion.numero > max ? seccion.numero : max, 0);
      const nuevoNumero = maxNumero + 1;

      const seccionUid = this.firestore.createId();
      const seccion: Seccion = { numero: nuevoNumero, seccionUid, asignaturaUid, cupos };

      await this.firestore.collection('secciones').doc(seccionUid).set(seccion);
      Swal.fire({
        title: 'Éxito!',
        text: 'Sección creada correctamente!',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se puede crear la sección!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }


  listarSeccionesPorAsignatura(asignaturaUid: string) {
    return this.firestore.collection<Seccion>('secciones', ref => ref.where('asignaturaUid', '==', asignaturaUid)).valueChanges();
  }

  getAsignaturas(): Observable<Asignatura[]> {
    return this.firestore.collection('asignaturas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Asignatura;
        data.uid = a.payload.doc.id;
        return data;
      }))
    );
  }

  getSecciones(): Observable<Seccion[]> {
    return this.firestore.collection<Seccion>('secciones').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Seccion;
        data.seccionUid = a.payload.doc.id;
        return data;
      }))
    );
  }

  async asignarAsignaturasAProfesor(profesorUid: string, asignaturaUids: string[]) {
    const batch = this.firestore.firestore.batch();

    try {
      const profesorRef = this.firestore.collection('profesores').doc(profesorUid).ref;

      for (const asignaturaUid of asignaturaUids) {
        const asignaturaRef = this.firestore.collection('asignaturas').doc(asignaturaUid).ref;
        const asignaturaSnapshot = await asignaturaRef.get();
        const asignaturaData = asignaturaSnapshot.data() as Asignatura;

        // Actualizar la asignatura con el profesorUid
        batch.update(asignaturaRef, { profesorUid });

        // Añadir la asignatura a la subcolección del profesor
        batch.set(profesorRef.collection('asignaturas').doc(asignaturaUid), {
          uid: asignaturaUid,
          nombre: asignaturaData.nombre
        });

        // Añadir las secciones de la asignatura a la subcolección del profesor
        const seccionesSnapshot = await this.firestore.collection('secciones', ref => ref.where('asignaturaUid', '==', asignaturaUid)).get().toPromise();
        if (seccionesSnapshot && !seccionesSnapshot.empty) {
          seccionesSnapshot.forEach(doc => {
            const seccionData = doc.data() as Seccion;
            seccionData.seccionUid = doc.id;
            batch.set(profesorRef.collection('asignaturas').doc(asignaturaUid).collection('secciones').doc(seccionData.seccionUid), seccionData);
          });
        }
      }

      await batch.commit();
      Swal.fire({
        title: 'Éxito!',
        text: 'Asignaturas asignadas correctamente!',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudieron asignar las asignaturas!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }

  async asignarSeccionesAProfesor(profesorUid: string, seccionUids: string[]) {
    const batch = this.firestore.firestore.batch();

    try {
      const profesorRef = this.firestore.collection('profesores').doc(profesorUid).ref;

      for (const seccionUid of seccionUids) {
        const seccionRef = this.firestore.collection('secciones').doc(seccionUid).ref;
        const seccionSnapshot = await seccionRef.get();
        const seccionData = seccionSnapshot.data() as Seccion;

        // Añadir la sección a la subcolección del profesor
        batch.set(profesorRef.collection('secciones').doc(seccionUid), seccionData);
      }

      await batch.commit();
      Swal.fire({
        title: 'Éxito!',
        text: 'Secciones asignadas correctamente!',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudieron asignar las secciones!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }

  listarAsignaturasPorProfesor(profesorUid: string): Observable<Asignatura[]> {
    return this.firestore.collection(`profesores/${profesorUid}/asignaturas`).valueChanges() as Observable<Asignatura[]>;
  }

  listarSeccionesPorProfesor(profesorUid: string): Observable<Seccion[]> {
    return this.firestore.collection(`profesores/${profesorUid}/secciones`).valueChanges() as Observable<Seccion[]>;
  }

  async asignarAlumnosASeccion(seccionUid: string, alumnoUids: string[]) {
    const batch = this.firestore.firestore.batch();

    try {
      const seccionRef = this.firestore.collection('secciones').doc(seccionUid).ref;

      for (const alumnoUid of alumnoUids) {
        const alumnoRef = this.firestore.collection('alumnos').doc(alumnoUid).ref;
        const alumnoSnapshot = await alumnoRef.get();
        const alumnoData = alumnoSnapshot.data() as Alumno;

        // Añadir el alumno a la subcolección de la sección
        batch.set(seccionRef.collection('alumnos').doc(alumnoUid), alumnoData);
      }

      await batch.commit();
      Swal.fire({
        title: 'Éxito!',
        text: 'Alumnos asignados correctamente!',
        icon: 'success',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudieron asignar los alumnos!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }

}