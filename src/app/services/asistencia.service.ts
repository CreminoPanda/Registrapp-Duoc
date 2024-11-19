import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Asistencia } from '../interfaces/asistencia';
import { Alumno } from '../interfaces/alumno';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  constructor(private firestore: AngularFirestore) {}

  createId(): string {
    return this.firestore.createId();
  }

  crearAsistencia(asistencia: Asistencia): Promise<void> {
    return this.firestore
      .collection('asistencias')
      .doc(asistencia.uid)
      .set(asistencia);
  }

  obtenerAsistencia(asistenciaUid: string): Observable<Asistencia> {
    return this.firestore
      .collection('asistencias')
      .doc<Asistencia>(asistenciaUid)
      .valueChanges()
      .pipe(
        map((asistencia) => {
          if (!asistencia) {
            throw new Error('Asistencia no encontrada');
          }
          return asistencia;
        })
      );
  }

  actualizarAsistencia(asistencia: Asistencia): Promise<void> {
    return this.firestore
      .collection('asistencias')
      .doc(asistencia.uid)
      .update(asistencia);
  }

  guardarClaseFinalizada(claseFinalizada: {
    fecha: Date;
    alumnosPresentes: number;
    seccionUid: string;
    asignaturaUid: string;
  }): Promise<DocumentReference<unknown>> {
    const { fecha, alumnosPresentes, seccionUid, asignaturaUid } =
      claseFinalizada;
    return this.firestore.collection('clasesFinalizadas').add({
      fecha,
      alumnosPresentes,
      seccionUid,
      asignaturaUid,
    });
  }

  obtenerAlumnosPorSeccion(seccionUid: string): Observable<Alumno[]> {
    return this.firestore
      .collection<Alumno>('usuarios', (ref: CollectionReference) =>
        ref.where('seccionUid', '==', seccionUid)
      )
      .valueChanges();
  }
}
