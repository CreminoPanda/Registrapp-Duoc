import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmar-asistencia',
  templateUrl: './confirmar-asistencia.page.html',
  styleUrls: ['./confirmar-asistencia.page.scss'],
})
export class ConfirmarAsistenciaPage implements OnInit {
  sesionId: string = '';
  alumnoId: string = 'alumno123'; // Reemplaza con el ID del alumno actual

  constructor(
    private route: ActivatedRoute,
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.sesionId = params['sesion_id'];
    });
  }

  async confirmarAsistencia() {
    try {
      const asistencia = await this.asistenciaService
        .obtenerAsistencia(this.sesionId)
        .toPromise();
      if (asistencia && asistencia.estudiantes) {
        asistencia.estudiantes[this.alumnoId] = true;
        await this.asistenciaService.actualizarAsistencia(asistencia);
        Swal.fire({
          title: 'Asistencia confirmada',
          text: 'Tu asistencia ha sido registrada exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        throw new Error('Asistencia no encontrada o estructura incorrecta');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al registrar tu asistencia.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
}
