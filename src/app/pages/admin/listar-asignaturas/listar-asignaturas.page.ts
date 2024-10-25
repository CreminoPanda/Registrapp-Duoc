import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Asignatura } from 'src/app/interfaces/asignatura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-asignaturas',
  templateUrl: './listar-asignaturas.page.html',
  styleUrls: ['./listar-asignaturas.page.scss'],
})
export class ListarAsignaturasPage implements OnInit {
  asignaturas: Asignatura[] = [];

  constructor(private asignaturaService: AsignaturaService, private router: Router) { }

  ngOnInit() {
    this.asignaturaService.getAsignaturas().subscribe({
      next: (asignaturas: Asignatura[]) => {
        this.asignaturas = asignaturas;
      },
      error: (error: any) => {
        console.error('Error al obtener las asignaturas:', error);
        Swal.fire({
          title: 'Error!',
          text: 'No se pueden obtener las asignaturas!',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }
    });
  }

  irACrearSeccion(asignaturaUid: string) {
    this.router.navigate(['/crear-seccion', asignaturaUid]);
  }

  irAListarSecciones(asignaturaUid: string) {
    this.router.navigate(['/listar-seccion', asignaturaUid]);
  }
  
}