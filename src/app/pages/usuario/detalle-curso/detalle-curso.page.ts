import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';

@Component({
  selector: 'app-detalle-curso',
  templateUrl: './detalle-curso.page.html',
  styleUrls: ['./detalle-curso.page.scss'],
})
export class DetalleCursoPage implements OnInit {
  seccion?: string | null;
  alumnos: Alumno[] = [];
  qrCodeDataUrl: string = '';

  constructor(private route: ActivatedRoute, private alumnosService: AlumnosService) {}

  ngOnInit() {
    this.seccion = this.route.snapshot.paramMap.get('seccion');
    if (this.seccion) {
      this.alumnosService.getAlumno().subscribe(alumnos => {
        this.alumnos = alumnos.filter(alumno => alumno.seccion === this.seccion);
      });
    }
  }
}