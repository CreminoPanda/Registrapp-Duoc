import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Seccion } from 'src/app/interfaces/seccion';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-asignaturas',
  templateUrl: './asignar-asignaturas.page.html',
  styleUrls: ['./asignar-asignaturas.page.scss'],
})
export class AsignarAsignaturasPage implements OnInit {
  profesorUid: string | null = null;
  asignaturas: Asignatura[] = [];
  secciones: Seccion[] = [];
  asignaturasSeleccionadas: string[] = [];
  seccionesSeleccionadas: string[] = [];

  constructor(
    private asignaturaService: AsignaturaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.profesorUid = this.route.snapshot.paramMap.get('profesorUid');
    this.asignaturaService.getAsignaturas().subscribe(asignaturas => {
      this.asignaturas = asignaturas;
    });
  }

  toggleAsignatura(asignaturaUid: string) {
    const index = this.asignaturasSeleccionadas.indexOf(asignaturaUid);
    if (index > -1) {
      this.asignaturasSeleccionadas.splice(index, 1);
      this.secciones = [];
    } else {
      this.asignaturasSeleccionadas.push(asignaturaUid);
      this.asignaturaService.listarSeccionesPorAsignatura(asignaturaUid).subscribe(secciones => {
        this.secciones = secciones;
      });
    }
  }

  toggleSeccion(seccionUid: string) {
    const index = this.seccionesSeleccionadas.indexOf(seccionUid);
    if (index > -1) {
      this.seccionesSeleccionadas.splice(index, 1);
    } else {
      this.seccionesSeleccionadas.push(seccionUid);
    }
  }

  asignarAsignaturasYSecciones() {
    if (this.profesorUid) {
      this.asignaturaService.asignarAsignaturasAProfesor(this.profesorUid, this.asignaturasSeleccionadas).then(() => {
        return this.asignaturaService.asignarSeccionesAProfesor(this.profesorUid!, this.seccionesSeleccionadas);
      }).then(() => {
        Swal.fire({
          title: 'Éxito!',
          text: 'Asignaturas y secciones asignadas correctamente!',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }).catch(error => {
        Swal.fire({
          title: 'Error!',
          text: 'No se pudieron asignar las asignaturas y secciones!',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo obtener el UID del profesor!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }
}