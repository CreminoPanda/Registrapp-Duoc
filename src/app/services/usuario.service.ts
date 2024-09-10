import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuarios = [
    {'email':'admin@admin.cl','pass':'admin123','nombre':'matias','apellido':'navarrete','rut':'12123123-K','tipo':'admin'},
    {'email':'user@user.cl','pass':'user123','nombre':'matias','apellido':'navarrete','rut':'12123123-K','tipo':'usuario'},
    {'email':'jo.rojass@duocuc.cl','pass':'invitado','nombre':'José','apellido':'Rojas','rut':'12123123-K','tipo':'invitado'},
  ];


  constructor() { }

  getUsuario(): Usuario[] {
    return this.usuarios;
  }

  getUsuarioByNombre() {

  }

  addUsuario(usuario: Usuario) {
    this.usuarios.push(usuario);
  }
  deleteUsuario(){

  }
  updateUsuario(){

  }

}
