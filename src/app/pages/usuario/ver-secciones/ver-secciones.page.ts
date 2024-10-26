import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Seccion } from 'src/app/interfaces/seccion';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-ver-secciones',
  templateUrl: './ver-secciones.page.html',
  styleUrls: ['./ver-secciones.page.scss'],
})
export class VerSeccionesPage implements OnInit {
  secciones: Seccion[] = [];
  profesorUid: string = '';
  asignaturaUid: string = '';

  constructor(
    private route: ActivatedRoute,
    private asignaturaService: AsignaturaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.asignaturaUid = this.route.snapshot.paramMap.get('asignaturaUid') || '';
    this.authService.isLogged().subscribe(user => {
      if (user) {
        this.profesorUid = user.uid;
        this.obtenerSecciones();
      }
    });
  }

  obtenerSecciones() {
    this.asignaturaService.listarSeccionesPorProfesor(this.profesorUid).subscribe(secciones => {
      this.secciones = secciones.filter(seccion => seccion.asignaturaUid === this.asignaturaUid);
    });
  }

  irADetalleSeccion(seccionUid: string) {
    this.router.navigate(['/generar-qr', { asignaturaUid: this.asignaturaUid, seccionUid }]);
  }
}