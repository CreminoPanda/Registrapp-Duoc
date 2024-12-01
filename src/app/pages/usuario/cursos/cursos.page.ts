import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { AuthService } from 'src/app/services/firebase/auth.service';

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
    this.authService.isLogged().subscribe((user) => {
      if (user) {
        this.profesorUid = user.uid;
      }
    });
  }
  verCurso(asignaturaUid: string) {
    this.router.navigate(['/ver-secciones', asignaturaUid]);
  }
}
