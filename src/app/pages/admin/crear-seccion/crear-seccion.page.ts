import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-seccion',
  templateUrl: './crear-seccion.page.html',
  styleUrls: ['./crear-seccion.page.scss'],
})
export class CrearSeccionPage implements OnInit {

  asignaturaUid: string | null = null;

  constructor(
    private asignaturaService: AsignaturaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.asignaturaUid = this.route.snapshot.paramMap.get('asignaturaUid');
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
        Swal.fire({
          title: 'Éxito!',
          text: 'Sección creada correctamente!',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false
        }).then(() => {
          this.router.navigate(['/admin-dashboard']);
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'No se puede crear la sección!',
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
}