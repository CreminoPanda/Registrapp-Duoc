import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Asignatura } from 'src/app/interfaces/asignatura'; 
import { Seccion } from 'src/app/interfaces/seccion';

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

}