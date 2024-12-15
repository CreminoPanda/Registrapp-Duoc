import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';

@Component({
  selector: 'app-ver-clases-pendientes',
  templateUrl: './ver-clases-pendientes.page.html',
  styleUrls: ['./ver-clases-pendientes.page.scss'],
})
export class VerClasesPendientesPage implements OnInit {
  seccionUid: string = '';
  clasesPendientes: any[] = [];
  nombreSeccion: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router,
    private asignaturaService: AsignaturaService
  ) {}

  ngOnInit() {
    this.seccionUid = this.route.snapshot.paramMap.get('seccionUid') || '';
    this.obtenerNombreSeccion();
    this.cargarClasesPendientes();
  }

  obtenerNombreSeccion() {
    this.asignaturaService
      .obtenerDetalleSeccion(this.seccionUid)
      .then((detalle) => {
        this.nombreSeccion = detalle.seccion.nombre;
      })
      .catch((error) => {
        console.error('Error al obtener el nombre de la sección:', error);
      });
  }

  cargarClasesPendientes() {
    this.firestore
      .collection('asistencias', (ref) =>
        ref
          .where('seccionUid', '==', this.seccionUid)
          .where('terminado', '==', false)
      )
      .snapshotChanges()
      .subscribe((snapshot) => {
        this.clasesPendientes = snapshot.map((doc) => {
          const data = doc.payload.doc.data() as any;
          return {
            ...data,
            asistenciaUid: doc.payload.doc.id,
            nombreSeccion: this.nombreSeccion,
          };
        });
        console.log(this.clasesPendientes);
      });
  }

  irAGenerarQR(asistenciaUid: string) {
    if (!asistenciaUid) {
      console.error('asistenciaUid is undefined');
      return;
    }
    this.router.navigate(['/generar-qr', this.seccionUid, asistenciaUid]);
  }
}
