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
  alumnosNoAsignados: { uid: string; nombre: string }[] = [];
  alumnosSeleccionados: string[] = [];
  asignaturaNombre: string = '';

  constructor(
    private route: ActivatedRoute,
    private asignaturaService: AsignaturaService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.asignaturaId = params.get('asignaturaId') || '';
      this.cargarAlumnosNoAsignados();
      this.cargarAsignaturaNombre();
    });
  }

  cargarAlumnosNoAsignados() {
    this.asignaturaService
      .obtenerAlumnosNoAsignados(this.asignaturaId)
      .then((alumnos) => {
        this.alumnosNoAsignados = alumnos;
        console.log('Alumnos no asignados cargados:', alumnos);
      })
      .catch((error) => {
        console.error('Error al cargar alumnos no asignados:', error);
      });
  }

  cargarAsignaturaNombre() {
    this.asignaturaService
      .obtenerAsignaturaPorUid(this.asignaturaId)
      .then((asignatura) => {
        if (asignatura) {
          this.asignaturaNombre = asignatura.nombre;
          this.generarNombreSeccion();
          console.log(
            'Nombre de la asignatura cargado:',
            this.asignaturaNombre
          );
        }
      })
      .catch((error) => {
        console.error('Error al cargar el nombre de la asignatura:', error);
      });
  }

  async generarNombreSeccion() {
    const palabras = this.asignaturaNombre.split(' ');
    let nombreBase = '';

    if (palabras.length === 1) {
      nombreBase = palabras[0].substring(0, 3).toUpperCase();
    } else {
      palabras.forEach((palabra) => {
        nombreBase += palabra[0].toUpperCase();
      });
    }

    const secciones = await this.asignaturaService.obtenerSecciones(
      this.asignaturaId
    );
    const numerosExistentes = secciones.map((seccion) =>
      parseInt(seccion.nombre.match(/\d+/)?.[0] || '0', 10)
    );
    const maxNumero = Math.max(...numerosExistentes, 0);
    const siguienteNumero = (maxNumero + 1).toString().padStart(3, '0');

    this.nombreSeccion = `${nombreBase}${siguienteNumero}D`;
    console.log('Nombre de la sección generado:', this.nombreSeccion);
  }

  agregarSeccion() {
    if (this.nombreSeccion.trim() === '' || this.cupos <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'Debe ingresar un nombre de sección y un número de cupos válido',
        icon: 'error',
      });
      console.error(
        'Error: Nombre de sección vacío o número de cupos inválido'
      );
      return;
    }

    if (this.alumnosSeleccionados.length > this.cupos) {
      Swal.fire({
        title: 'Error',
        text: 'El número de alumnos seleccionados excede el número de cupos',
        icon: 'error',
      });
      console.error(
        'Error: El número de alumnos seleccionados excede el número de cupos'
      );
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
        console.log('Sección creada exitosamente:', nuevaSeccion);
        this.nombreSeccion = '';
        this.cupos = 0;
        this.alumnosSeleccionados = [];
        this.cargarAlumnosNoAsignados();
        this.generarNombreSeccion(); // Generar un nuevo nombre para la siguiente sección
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
