import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ver-clases-pendientes',
  templateUrl: './ver-clases-pendientes.page.html',
  styleUrls: ['./ver-clases-pendientes.page.scss'],
})
export class VerClasesPendientesPage implements OnInit {
  seccionUid: string = '';
  clasesPendientes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.seccionUid = this.route.snapshot.paramMap.get('seccionUid') || '';
    this.cargarClasesPendientes();
  }

  cargarClasesPendientes() {
    this.firestore
      .collection('asistencias', (ref) =>
        ref
          .where('seccionUid', '==', this.seccionUid)
          .where('terminado', '==', false)
      )
      .snapshotChanges() // Usar snapshotChanges para obtener el ID del documento
      .subscribe((snapshot) => {
        this.clasesPendientes = snapshot.map((doc) => {
          const data = doc.payload.doc.data() as any; // Asegurarse de que data es un objeto
          return {
            ...data,
            asistenciaUid: doc.payload.doc.id, // Incluir el ID del documento como asistenciaUid
          };
        });
        console.log(this.clasesPendientes); // Verificar los datos
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
