import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuarios = [
    {'email':'admin@admin.cl','pass':'admin123','nombre':'matias','apellido':'navarrete','rut':'12123123-K','tipo':'admin'},
    {'email':'jo.rojass@duocuc.cl','pass':'invitado','nombre':'José','apellido':'Rojas','rut':'12123123-K','tipo':'invitado'},
    {'email':'profe@profe.cl','pass':'profe123','nombre':'José','apellido':'Rojas','rut':'12123123-K','tipo':'profesor'}
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
