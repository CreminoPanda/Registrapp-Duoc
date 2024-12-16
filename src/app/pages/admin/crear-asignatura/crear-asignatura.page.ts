import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Asignatura } from 'src/app/interfaces/asignatura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-asignatura',
  templateUrl: './crear-asignatura.page.html',
  styleUrls: ['./crear-asignatura.page.scss'],
})
export class CrearAsignaturaPage implements OnInit {
  nombreAsignatura: string = '';

  constructor(private asignaturaService: AsignaturaService) {}

  ngOnInit() {}

  async crearAsignatura() {
    if (this.nombreAsignatura.trim() === '') {
      Swal.fire({
        title: 'Error',
        text: 'El nombre de la asignatura no puede estar vacío',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      return;
    }

    const nombreLowerCase = this.nombreAsignatura.toLowerCase();
    const asignaturaExiste = await this.asignaturaService.asignaturaExiste(
      nombreLowerCase
    );
    if (asignaturaExiste) {
      Swal.fire({
        title: 'Error',
        text: 'No puedes crear una asignatura ya existente',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false,
      });
      return;
    }

    const nuevaAsignatura: Asignatura = {
      uid: '',
      nombre: this.nombreAsignatura,
      nombreLowerCase: nombreLowerCase,
    };

    this.asignaturaService
      .crearAsignatura(nuevaAsignatura)
      .then(() => {
        Swal.fire({
          title: 'Asignatura creada',
          text: 'La asignatura ha sido creada exitosamente',
          icon: 'success',
          confirmButtonText: 'OK',
          heightAuto: false,
        });
        this.nombreAsignatura = '';
      })
      .catch((error: any) => {
        Swal.fire({
          title: 'Error',
          text: 'Error al crear la asignatura',
          icon: 'error',
          confirmButtonText: 'OK',
          heightAuto: false,
        });
        console.error('Error al crear la asignatura:', error);
      });
  }
}
