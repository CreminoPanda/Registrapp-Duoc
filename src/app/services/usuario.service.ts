import { Injectable } from '@angular/core';
import axios from 'axios';
import { Usuario } from '../interfaces/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuarios = [
    {'email':'admin@admin.cl','pass':'admin123','nombre':'matias','apellido':'navarrete','rut':'12123123-K','tipo':'admin'},
    {'email':'jo.rojass@duocuc.cl','pass':'invitado','nombre':'José','apellido':'Rojas','rut':'12123123-K','tipo':'invitado'},
    {'email':'profe@profe.cl','pass':'profe123','nombre':'José','apellido':'Rojas','rut':'12123123-K','tipo':'profesor'}
  ];

  constructor(private angularFirestore: AngularFirestore) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.angularFirestore.collection<Usuario>('usuarios').valueChanges();
  }

  getUsuarioByNombre() {
    // Implementar lógica para obtener usuario por nombre
  }

  addUsuario(usuario: Usuario) {
    this.usuarios.push(usuario);
  }

  deleteUsuario() {
    // Implementar lógica para eliminar usuario
  }

  updateUsuario() {
    // Implementar lógica para actualizar usuario
  }

  private generarRut(): string {
    const digitos = Math.floor(Math.random() * 100000000);
    const dv = Math.floor(Math.random() * 10);
    return `${digitos}-${dv}`;
  }

  private generarCorreo(nombre: string, apellido: string, segundoApellido: string, tipo: string): string {
    const nombrePart = nombre
    const apellidoPart = apellido
    const segundoApellidoPart = segundoApellido.charAt(0).toLowerCase();
    if (tipo === 'profesor') {
      return `${nombrePart}.${apellidoPart}.${segundoApellidoPart}@profesor.duoc.cl`;
    } else {  
      return `${nombrePart}.${apellidoPart}.${segundoApellidoPart}@duocuc.cl`;
    }
  }

  private generarPassword(nombre: string): string {
    return `${nombre.substring(0, 4).toLowerCase()}1234`;
  }

  private limpiarTexto(texto: string): string {
    return texto.replace(/[^a-zA-Z]/g, '');
  }

  async getRandomUsers(count: number): Promise<Usuario[]> {
    try {
      const response = await axios.get(`https://randomuser.me/api/?results=${count}&nat=es`);
      return response.data.results.map((user: any, index: number) => {
        const tipo = index < 5 ? 'profesor' : 'alumno';
        const nombre = this.limpiarTexto(user.name.first);
        const apellido = this.limpiarTexto(user.name.last);
        const email = this.generarCorreo(nombre, apellido, apellido, tipo);
        const pass = this.generarPassword(nombre);
        const rut = this.generarRut();
        return {
          email,
          pass,
          nombre,
          apellido,
          rut,
          tipo
        };
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

}