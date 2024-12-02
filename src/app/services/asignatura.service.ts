import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Asignatura } from '../interfaces/asignatura';
import { Seccion } from '../interfaces/seccion';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AsignaturaService {
  constructor(private firestore: AngularFirestore) {}

  crearAsignatura(asignatura: Asignatura): Promise<void> {
    const asignaturaId = this.firestore.createId();
    return this.firestore
      .collection('asignaturas')
      .doc(asignaturaId)
      .set({ ...asignatura, uid: asignaturaId });
  }

  agregarProfesor(asignaturaId: string, profesorUid: string): Promise<void> {
    return this.firestore
      .collection('asignaturas')
      .doc(asignaturaId)
      .get()
      .toPromise()
      .then((doc) => {
        if (doc && doc.exists) {
          const asignatura = doc.data() as Asignatura;
          if (
            asignatura.profesores &&
            asignatura.profesores.includes(profesorUid)
          ) {
            return Promise.reject(
              'El profesor ya está asignado a esta asignatura'
            );
          } else {
            return this.firestore
              .collection('asignaturas')
              .doc(asignaturaId)
              .update({
                profesores:
                  firebase.firestore.FieldValue.arrayUnion(profesorUid),
              });
          }
        } else {
          return Promise.reject('Asignatura no encontrada');
        }
      });
  }

  listarAsignaturas() {
    return this.firestore.collection<Asignatura>('asignaturas').valueChanges();
  }

  listarAsignaturasPorProfesor(profesorUid: string) {
    return this.firestore
      .collection('asignaturas', (ref) =>
        ref.where('profesores', 'array-contains', profesorUid)
      )
      .valueChanges();
  }

  listarSeccionesPorProfesor(profesorUid: string) {
    return this.firestore
      .collection('secciones', (ref) =>
        ref.where('profesorUid', '==', profesorUid)
      )
      .valueChanges();
  }

  asignaturaExiste(nombre: string): Promise<boolean> {
    const nombreLowerCase = nombre.toLowerCase();
    return this.firestore
      .collection('asignaturas', (ref) =>
        ref.where('nombreLowerCase', '==', nombreLowerCase)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot) {
          return !querySnapshot.empty;
        }
        return false;
      });
  }

  agregarSeccion(asignaturaId: string, seccion: Seccion): Promise<void> {
    const seccionId = this.firestore.createId();
    return this.firestore
      .collection('secciones')
      .doc(seccionId)
      .set({ ...seccion, uid: seccionId, asignaturaId })
      .then(() => {
        return this.asignarAlumnosASeccion(
          asignaturaId,
          seccionId,
          seccion.cupos
        );
      });
  }

  private asignarAlumnosASeccion(
    asignaturaId: string,
    seccionId: string,
    cupos: number
  ): Promise<void> {
    return this.firestore
      .collection('usuarios', (ref) =>
        ref.where('tipo', '==', 'alumno').limit(cupos)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot) {
          const alumnos: string[] = [];
          querySnapshot.forEach((doc) => {
            alumnos.push(doc.id);
          });
          return this.firestore
            .collection('asignaturas')
            .doc(asignaturaId)
            .collection('secciones')
            .doc(seccionId)
            .update({ alumnos: alumnos });
        } else {
          return Promise.reject('No se encontraron alumnos');
        }
      });
  }

  obtenerAlumnosNoAsignados(
    asignaturaId: string
  ): Promise<{ uid: string; nombre: string }[]> {
    return this.firestore
      .collection('usuarios', (ref) => ref.where('tipo', '==', 'alumno'))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (!querySnapshot) {
          return [];
        }
        const alumnos: { uid: string; nombre: string }[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as { nombre: string };
          alumnos.push({ uid: doc.id, nombre: data.nombre });
        });
        return this.firestore
          .collection('secciones', (ref) =>
            ref.where('asignaturaId', '==', asignaturaId)
          )
          .get()
          .toPromise()
          .then((seccionesSnapshot) => {
            if (seccionesSnapshot && !seccionesSnapshot.empty) {
              const alumnosAsignados = seccionesSnapshot.docs.flatMap((doc) => {
                const seccion = doc.data() as Seccion;
                return seccion.alumnos;
              });
              return alumnos.filter(
                (alumno) => !alumnosAsignados.includes(alumno.uid)
              );
            } else {
              return alumnos;
            }
          });
      });
  }

  obtenerAsignaturaPorUid(
    asignaturaId: string
  ): Promise<Asignatura | undefined> {
    return this.firestore
      .collection('asignaturas')
      .doc(asignaturaId)
      .get()
      .toPromise()
      .then((doc) => {
        if (doc && doc.exists) {
          return doc.data() as Asignatura;
        } else {
          return undefined;
        }
      });
  }

  obtenerSecciones(asignaturaId: string): Promise<Seccion[]> {
    return this.firestore
      .collection('secciones', (ref) =>
        ref.where('asignaturaId', '==', asignaturaId)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot && !querySnapshot.empty) {
          return querySnapshot.docs.map((doc) => doc.data() as Seccion);
        } else {
          return [];
        }
      });
  }
}
