import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Seccion } from 'src/app/interfaces/seccion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-seccion',
  templateUrl: './listar-seccion.page.html',
  styleUrls: ['./listar-seccion.page.scss'],
})
export class ListarSeccionPage implements OnInit {

  secciones: Seccion[] = [];
  asignaturaUid: string | null = null;

  constructor(
    private asignaturaService: AsignaturaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.asignaturaUid = this.route.snapshot.paramMap.get('asignaturaUid');
    if (this.asignaturaUid) {
      this.asignaturaService.listarSeccionesPorAsignatura(this.asignaturaUid).subscribe({
        next: (secciones: Seccion[]) => {
          this.secciones = secciones.sort((a, b) => a.numero - b.numero);
        },
        error: (error: any) => {
          console.error('Error al obtener las secciones:', error);
          Swal.fire({
            title: 'Error!',
            text: 'No se pueden obtener las secciones!',
            icon: 'error',
            confirmButtonText: 'OK',
            heightAuto: false
          });
        }
      });
    }
  }
}