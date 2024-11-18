import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alumno } from '../interfaces/alumno';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  constructor(private firestore: AngularFirestore) {}

  getAlumno(): Observable<Alumno[]> {
    return this.firestore
      .collection<Alumno>('usuarios', (ref) =>
        ref.where('tipo', '==', 'alumno')
      )
      .valueChanges();
  }

  getAlumnoByUid(uid: string): Observable<Alumno | undefined> {
    return this.firestore
      .collection<Alumno>('usuarios')
      .doc(uid)
      .valueChanges();
  }
}
