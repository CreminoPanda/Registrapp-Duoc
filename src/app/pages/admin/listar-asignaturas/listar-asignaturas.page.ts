import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Asignatura } from 'src/app/interfaces/asignatura';

@Component({
  selector: 'app-listar-asignaturas',
  templateUrl: './listar-asignaturas.page.html',
  styleUrls: ['./listar-asignaturas.page.scss'],
})
export class ListarAsignaturasPage implements OnInit {
  asignaturas: Asignatura[] = [];

  constructor(
    private asignaturaService: AsignaturaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.asignaturaService
      .listarAsignaturas()
      .subscribe((asignaturas: Asignatura[]) => {
        this.asignaturas = asignaturas;
      });
  }

  irACrearSeccion(asignaturaId: string) {
    this.router.navigate(['/crear-seccion', asignaturaId]);
  }
}
