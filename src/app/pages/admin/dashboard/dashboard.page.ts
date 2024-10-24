import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuariosService: UsuariosService, private router:Router) { }

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  eliminarUsuario(uid: string) {
    this.usuariosService.deleteUsuario(uid).catch(error => {
      console.error('Error al eliminar usuario:', error);
    });
  }

  irAActualizarUsuario(uid: string) {
    this.router.navigate(['/actualizar-usuario', uid]);
  }


}