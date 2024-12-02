import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Seccion } from 'src/app/interfaces/seccion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-secciones',
  templateUrl: './ver-secciones.page.html',
  styleUrls: ['./ver-secciones.page.scss'],
})
export class VerSeccionesPage implements OnInit {
  profesorUid: string | null = null;
  asignaturaUid: string | null = null;
  secciones: Seccion[] = [];

  constructor(
    private route: ActivatedRoute,
    private asignaturaService: AsignaturaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profesorUid = this.route.snapshot.paramMap.get('profesorUid');
    this.asignaturaUid = this.route.snapshot.paramMap.get('asignaturaUid');
    this.cargarSecciones();
  }

  cargarSecciones() {
    if (this.profesorUid && this.asignaturaUid) {
      this.asignaturaService
        .listarSeccionesPorProfesor(this.profesorUid)
        .subscribe((secciones: Seccion[]) => {
          this.secciones = secciones.filter(
            (seccion) => seccion.asignaturaUid === this.asignaturaUid
          );
        });
    }
  }

  irAGenerarQR(seccionId: string) {
    this.router.navigate(['/generar-qr', seccionId]);
  }
}
