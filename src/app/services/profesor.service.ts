import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Profesor } from 'src/app/interfaces/profesor';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Seccion } from 'src/app/interfaces/seccion';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  constructor(private firestore: AngularFirestore) {}

  getProfesores(): Observable<Profesor[]> {
    return this.firestore.collection<Profesor>('profesores').valueChanges();
  }

  getAsignaturasPorProfesor(profesorUid: string): Observable<Asignatura[]> {
    return this.firestore.collection('profesores').doc(profesorUid).collection<Asignatura>('asignaturas').valueChanges();
  }

  getSeccionesPorAsignatura(profesorUid: string, asignaturaUid: string): Observable<Seccion[]> {
    return this.firestore.collection('profesores').doc(profesorUid).collection('asignaturas').doc(asignaturaUid).collection<Seccion>('secciones').valueChanges();
  }

  async asignarAsignaturasAProfesor(profesorUid: string, asignaturas: Asignatura[]) {
    const batch = this.firestore.firestore.batch();
    const profesorRef = this.firestore.collection('profesores').doc(profesorUid).ref;

    try {
      for (const asignatura of asignaturas) {
        const asignaturaRef = profesorRef.collection('asignaturas').doc(asignatura.uid);
        batch.set(asignaturaRef, { uid: asignatura.uid, nombre: asignatura.nombre });

        for (const seccion of asignatura.secciones || []) {
          const seccionRef = asignaturaRef.collection('secciones').doc(seccion.seccionUid);
          batch.set(seccionRef, { uid: seccion.seccionUid, numero: seccion.numero, cupos: seccion.cupos });
        }
      }

      await batch.commit();
      console.log('Asignaturas asignadas correctamente!');
    } catch (error) {
      console.error('Error al asignar asignaturas:', error);
    }
  }
}