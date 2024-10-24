import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnosService } from '../../../services/alumnos.service';
import { Alumno } from '../../../interfaces/alumno';

@Component({
  selector: 'app-detalle-curso',
  templateUrl: './detalle-curso.page.html',
  styleUrls: ['./detalle-curso.page.scss'],
})
export class DetalleCursoPage implements OnInit {
  curso?: string | null;
  alumnos: Alumno[] = [];
  qrCodeDataUrl: string = '';

  constructor(private route: ActivatedRoute, private alumnosService: AlumnosService) {}

  ngOnInit() {
    this.curso = this.route.snapshot.paramMap.get('curso');
    if (this.curso) {
      this.alumnos = this.alumnosService.getAlumno().filter(alumno => alumno.curso === this.curso);
    }
  }



}