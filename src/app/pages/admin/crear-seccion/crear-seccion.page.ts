import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Seccion } from 'src/app/interfaces/seccion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-seccion',
  templateUrl: './crear-seccion.page.html',
  styleUrls: ['./crear-seccion.page.scss'],
})
export class CrearSeccionPage implements OnInit {
  asignaturaId: string = '';
  nombreSeccion: string = '';
  cupos: number = 0;
  alumnosNoAsignados: string[] = [];
  alumnosSeleccionados: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private asignaturaService: AsignaturaService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.asignaturaId = params.get('asignaturaId') || '';
      this.cargarAlumnosNoAsignados();
    });
  }

  cargarAlumnosNoAsignados() {
    this.asignaturaService
      .obtenerAlumnosNoAsignados(this.asignaturaId)
      .then((alumnos) => {
        this.alumnosNoAsignados = alumnos;
      });
  }

  agregarSeccion() {
    if (this.nombreSeccion.trim() === '' || this.cupos <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'Debe ingresar un nombre de sección y un número de cupos válido',
        icon: 'error',
      });
      return;
    }

    const nuevaSeccion: Seccion = {
      uid: '',
      nombre: this.nombreSeccion,
      cupos: this.cupos,
      alumnos: this.alumnosSeleccionados,
    };

    this.asignaturaService
      .agregarSeccion(this.asignaturaId, nuevaSeccion)
      .then(() => {
        Swal.fire({
          title: 'Sección creada',
          text: 'La sección ha sido creada exitosamente',
          icon: 'success',
        });
        this.nombreSeccion = '';
        this.cupos = 0;
        this.alumnosSeleccionados = [];
        this.cargarAlumnosNoAsignados();
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Error al crear la sección',
          icon: 'error',
        });
        console.error('Error al crear la sección:', error);
      });
  }
}
