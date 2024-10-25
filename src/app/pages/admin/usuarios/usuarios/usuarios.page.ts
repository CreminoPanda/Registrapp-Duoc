import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { UsuariosService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuariosService: UsuariosService, private router: Router, private auth:AuthService) { }

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

  navigateToUserType(tipo: string) {
    this.router.navigate(['/lista-usuarios', { tipo }]);
  }

  async logout() {
    try {
      await this.auth.logout();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}