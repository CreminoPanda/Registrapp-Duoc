import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-asignatura',
  templateUrl: './crear-asignatura.page.html',
  styleUrls: ['./crear-asignatura.page.scss'],
})
export class CrearAsignaturaPage implements OnInit {
  asignaturaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private asignaturaService: AsignaturaService
  ) {
    this.asignaturaForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async crearAsignatura() {
    if (this.asignaturaForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
      return;
    }

    const nombre = this.asignaturaForm.get('nombre')?.value;

    try {
      await this.asignaturaService.crearAsignatura(nombre);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se puede crear la asignatura!',
        icon: 'error',
        confirmButtonText: 'OK',
        heightAuto: false
      });
    }
  }
}