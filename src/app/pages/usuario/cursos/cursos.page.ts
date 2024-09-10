import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})


export class CursosPage implements OnInit {

  cursos = [
    {curso:'Aplicaciones Moviles 010D', imagen:'/assets/icon/fotos/movil.png'},
    {curso:'Aplicaciones Moviles 011D', imagen:'/assets/icon/fotos/movil.png'},
    {curso:'Aplicaciones Moviles 012D', imagen:'/assets/icon/fotos/movil.png'},
    {curso:'Aplicaciones Moviles 013D', imagen:'/assets/icon/fotos/movil.png'},
    {curso:'Aplicaciones Moviles 014D', imagen:'/assets/icon/fotos/movil.png'}
  ];

  constructor(private router:Router) {}

  ngOnInit() {
  }

  verCurso(curso: string){
    this.router.navigate(['/detalle-curso', curso]);
  }

}