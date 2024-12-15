import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario.service';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { Asignatura } from 'src/app/interfaces/asignatura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-asignaturas',
  templateUrl: './asignar-asignaturas.page.html',
  styleUrls: ['./asignar-asignaturas.page.scss'],
})
export class AsignarAsignaturasPage implements OnInit {
  profesores: Usuario[] = [];
  asignaturas: Asignatura[] = [];
  asignaturaSeleccionada: string = '';
  profesorSeleccionado: string = '';

  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private asignaturaService: AsignaturaService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.profesorSeleccionado = params.get('uid') || '';
    });

    this.usuariosService.getProfesores().subscribe((profesores: Usuario[]) => {
      this.profesores = profesores;
    });

    this.asignaturaService
      .listarAsignaturas()
      .subscribe((asignaturas: Asignatura[]) => {
        this.asignaturas = asignaturas;
      });
  }

  asignarAsignatura() {
    if (
      this.asignaturaSeleccionada.trim() === '' ||
      this.profesorSeleccionado.trim() === ''
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar una asignatura y un profesor',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      return;
    }

    this.asignaturaService
      .agregarProfesor(this.asignaturaSeleccionada, this.profesorSeleccionado)
      .then(() => {
        Swal.fire({
          title: 'Asignatura asignada',
          text: 'La asignatura ha sido asignada exitosamente',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false,
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: error,
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false,
        });
        console.error('Error al asignar la asignatura:', error);
      });
  }
}
