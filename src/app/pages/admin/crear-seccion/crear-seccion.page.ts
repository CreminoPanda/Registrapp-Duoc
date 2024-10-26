import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import Swal from 'sweetalert2';
import { Alumno } from 'src/app/interfaces/alumno';

@Component({
  selector: 'app-crear-seccion',
  templateUrl: './crear-seccion.page.html',
  styleUrls: ['./crear-seccion.page.scss'],
})
export class CrearSeccionPage implements OnInit {
  cupos: number | null = null;
  alumnos: Alumno[] = [];
  asignaturaUid: string | null = null;
  alumnosSeleccionados: string[] = [];

  constructor(
    private alumnosService: AlumnosService,
    private asignaturaService: AsignaturaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.asignaturaUid = this.route.snapshot.paramMap.get('asignaturaUid');
    this.alumnosService.getAlumno().subscribe(alumnos => {
      this.alumnos = alumnos;
    });
  }

  async crearSeccion(cupos: string | number | null | undefined) {
    if (cupos == null || cupos === '') {
      Swal.fire({
        title: 'Error!',
        text: 'El número de cupos es requerido!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
      return;
    }

    const cuposNumber = Number(cupos);
    if (isNaN(cuposNumber)) {
      Swal.fire({
        title: 'Error!',
        text: 'El número de cupos debe ser un número válido!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
      return;
    }

    if (this.asignaturaUid) {
      try {
        await this.asignaturaService.crearSeccion(this.asignaturaUid, cuposNumber);
        await this.asignaturaService.asignarAlumnosASeccion(this.asignaturaUid, this.alumnosSeleccionados);
        Swal.fire({
          title: 'Éxito!',
          text: 'Sección creada y alumnos asignados correctamente!',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false
        }).then(() => {
          this.router.navigate(['/admin-dashboard']);
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'No se puede crear la sección o asignar los alumnos!',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No se ha seleccionado una asignatura!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }

  // Método para manejar la selección de alumnos
  toggleAlumno(alumnoUid: string) {
    const index = this.alumnosSeleccionados.indexOf(alumnoUid);
    if (index > -1) {
      this.alumnosSeleccionados.splice(index, 1);
    } else {
      this.alumnosSeleccionados.push(alumnoUid);
    }
  }
}