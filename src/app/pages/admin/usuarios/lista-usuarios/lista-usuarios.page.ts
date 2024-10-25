import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {
  usuarios: Usuario[] = [];
  tipo: string = '';

  constructor(private route: ActivatedRoute, private usuariosService: UsuariosService, private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tipo = params['tipo'];
      this.usuariosService.getUsuarios().subscribe(data => {
        this.usuarios = data.filter(usuario => usuario.tipo === this.tipo);
      });
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