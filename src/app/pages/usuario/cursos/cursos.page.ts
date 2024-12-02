import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { Asignatura } from 'src/app/interfaces/asignatura';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {
  asignaturas: Asignatura[] = [];
  profesorUid: string = '';

  constructor(
    private router: Router,
    private asignaturaService: AsignaturaService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isLogged().subscribe(
      (uid: string | null) => {
        console.log('Usuario UID:', uid);
        if (uid) {
          this.profesorUid = uid;
          console.log('Profesor UID:', this.profesorUid);
          this.cargarAsignaturas();
        }
      },
      (error: any) => {
        console.error('Error al verificar la autenticación:', error);
      }
    );
  }

  cargarAsignaturas() {
    if (this.profesorUid) {
      this.asignaturaService
        .listarAsignaturasPorProfesor(this.profesorUid)
        .subscribe((asignaturas: Asignatura[]) => {
          this.asignaturas = asignaturas;
        });
    }
  }

  verSecciones(asignaturaUid: string) {
    this.router.navigate(['/ver-secciones', this.profesorUid, asignaturaUid]);
  }
}
