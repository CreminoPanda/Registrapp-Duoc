import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Asignatura } from '../interfaces/asignatura';
import { Seccion } from '../interfaces/seccion';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

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

  listarProfesores(): Observable<any[]> {
    return this.firestore.collection('profesores').valueChanges();
  }

  listarAsignaturasPorProfesor(profesorUid: string): Observable<Asignatura[]> {
    return this.firestore
      .collection<Asignatura>('asignaturas', (ref) =>
        ref.where('profesores', 'array-contains', profesorUid)
      )
      .valueChanges();
  }

  listarSeccionesPorProfesor(profesorUid: string): Observable<Seccion[]> {
    return this.firestore
      .collection<Seccion>('secciones', (ref) =>
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

  agregarSeccion(
    asignaturaId: string,
    seccion: Seccion,
    profesorUid: string
  ): Promise<void> {
    const seccionId = this.firestore.createId();
    return this.firestore
      .collection('secciones')
      .doc(seccionId)
      .set({ ...seccion, uid: seccionId, asignaturaId, profesorUid })
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

  obtenerProfesoresAsignados(
    asignaturaId: string
  ): Promise<{ uid: string; nombre: string }[]> {
    return this.firestore
      .collection('asignaturas')
      .doc(asignaturaId)
      .get()
      .toPromise()
      .then((asignaturaDoc) => {
        if (asignaturaDoc && asignaturaDoc.exists) {
          const asignatura = asignaturaDoc.data() as Asignatura;
          const profesoresAsignados = asignatura.profesores || [];
          if (profesoresAsignados.length === 0) {
            return [];
          }
          return this.firestore
            .collection('usuarios', (ref) =>
              ref.where('uid', 'in', profesoresAsignados)
            )
            .get()
            .toPromise()
            .then((querySnapshot) => {
              if (!querySnapshot) {
                return [];
              }
              const profesores: { uid: string; nombre: string }[] = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data() as { nombre: string };
                profesores.push({ uid: doc.id, nombre: data.nombre });
              });
              return profesores;
            });
        } else {
          return [];
        }
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

  obtenerAlumnosPorSeccion(seccionUid: string): Promise<any[]> {
    return this.firestore
      .collection('secciones')
      .doc(seccionUid)
      .get()
      .toPromise()
      .then((seccionDoc) => {
        if (!seccionDoc || !seccionDoc.exists) {
          return [];
        }
        const seccion = seccionDoc.data() as Seccion;
        const alumnosUids = seccion.alumnos || [];
        const alumnosPromises = alumnosUids.map((uid) =>
          this.firestore.collection('usuarios').doc(uid).get().toPromise()
        );
        return Promise.all(alumnosPromises).then((alumnosDocs) => {
          return alumnosDocs
            .filter((doc) => doc && doc.exists)
            .map((doc) => (doc ? doc.data() : null))
            .filter((alumno) => alumno !== null);
        });
      });
  }

  marcarAsistencia(
    asistenciaUid: string,
    alumnoUid: string,
    presente: boolean
  ): Promise<void> {
    return this.firestore
      .collection('asistencias')
      .doc(asistenciaUid)
      .get()
      .toPromise()
      .then((doc) => {
        if (doc && doc.exists) {
          const asistencia = doc.data() as any;
          const alumnos = asistencia.alumnos || {};
          const alumno = alumnos[alumnoUid];
          if (alumno) {
            alumno.presente = presente;
          } else {
            alumnos[alumnoUid] = { presente };
          }
          return this.firestore
            .collection('asistencias')
            .doc(asistenciaUid)
            .update({ alumnos });
        } else {
          return Promise.reject('Asistencia no encontrada');
        }
      });
  }

  guardarAsistencia(
    asistencia: any
  ): Promise<
    firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
  > {
    return this.firestore
      .collection<firebase.firestore.DocumentData>('asistencias')
      .add(asistencia);
  }

  obtenerDetalleSeccion(seccionUid: string): Promise<any> {
    return this.firestore
      .collection('secciones')
      .doc(seccionUid)
      .get()
      .toPromise()
      .then((seccionDoc) => {
        if (!seccionDoc || !seccionDoc.exists) {
          throw new Error('Sección no encontrada');
        }
        const seccion = seccionDoc.data() as Seccion;
        return this.firestore
          .collection('usuarios')
          .doc(seccion.profesorUid)
          .get()
          .toPromise()
          .then((profesorDoc) => {
            if (!profesorDoc || !profesorDoc.exists) {
              throw new Error('Profesor no encontrado');
            }
            const profesor = profesorDoc.data();
            return this.firestore
              .collection('asignaturas')
              .doc(seccion.asignaturaUid)
              .get()
              .toPromise()
              .then((asignaturaDoc) => {
                if (!asignaturaDoc || !asignaturaDoc.exists) {
                  throw new Error('Asignatura no encontrada');
                }
                const asignatura = asignaturaDoc.data();
                return { seccion, profesor, asignatura };
              });
          });
      });
  }

  finalizarClase(seccionUid: string): Promise<void> {
    return this.firestore
      .collection('secciones')
      .doc(seccionUid)
      .collection('alumnos')
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (!querySnapshot) {
          return;
        }
        const alumnosPresentes = querySnapshot.docs.filter(
          (doc) => doc.data()['presente']
        ).length;
        const fecha = new Date();
        return this.firestore
          .collection('asistencias')
          .add({
            seccionUid: seccionUid,
            fecha: fecha,
            alumnosPresentes: alumnosPresentes,
          })
          .then(() => {});
      });
  }
  obtenerAsistenciaPorSeccion(seccionUid: string) {
    return this.firestore
      .collection('asistencias', (ref) =>
        ref.where('seccionUid', '==', seccionUid)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot && !querySnapshot.empty) {
          const asistencia = querySnapshot.docs[0].data();
          return { uid: querySnapshot.docs[0].id, ...(asistencia || {}) };
        } else {
          throw new Error(
            'No se encontró asistencia para la sección proporcionada.'
          );
        }
      });
  }
}
