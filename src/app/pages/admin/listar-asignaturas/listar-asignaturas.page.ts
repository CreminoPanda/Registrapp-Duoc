import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Asignatura } from 'src/app/interfaces/asignatura';

@Component({
  selector: 'app-listar-asignaturas',
  templateUrl: './listar-asignaturas.page.html',
  styleUrls: ['./listar-asignaturas.page.scss'],
})
export class ListarAsignaturasPage implements OnInit {
  asignaturas: Asignatura[] = [];

  constructor(
    private asignaturaService: AsignaturaService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.asignaturaService
      .listarAsignaturas()
      .subscribe((asignaturas: Asignatura[]) => {
        this.asignaturas = asignaturas;
      });
  }

  irACrearSeccion(asignaturaId: string) {
    this.navCtrl.navigateForward('/crear-seccion/' + asignaturaId);
  }
}
