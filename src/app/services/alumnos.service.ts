import { Injectable } from '@angular/core';
import { Alumno } from '../interfaces/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  alumnos: Alumno[] = [
    {nombre: 'Juan', apellido: 'Pérez', correo: 'juan.perez@duocuc.cl', curso: 'Aplicaciones Moviles 010D'},
    {nombre: 'Ana', apellido: 'Gómez', correo: 'ana.gomez@duocuc.cl', curso: 'Aplicaciones Moviles 011D'},
    {nombre: 'Luis', apellido: 'Rodriguez', correo: 'luis.rodriguez@duocuc.cl', curso: 'Aplicaciones Moviles 012D'},
    {nombre: 'María', apellido: 'Fernández', correo: 'maria.fernandez@duocuc.cl', curso: 'Aplicaciones Moviles 013D'},
    {nombre: 'Carlos', apellido: 'Ramírez', correo: 'carlos.ramirez@duocuc.cl', curso: 'Aplicaciones Moviles 014D'},
    {nombre: 'Laura', apellido: 'Martínez', correo: 'laura.martinez@duocuc.cl', curso: 'Aplicaciones Moviles 010D'},
    {nombre: 'Jorge', apellido: 'Morales', correo: 'jorge.morales@duocuc.cl', curso: 'Aplicaciones Moviles 011D'},
    {nombre: 'Sofía', apellido: 'Jiménez', correo: 'sofia.jimenez@duocuc.cl', curso: 'Aplicaciones Moviles 012D'},
    {nombre: 'Andrés', apellido: 'Castro', correo: 'andres.castro@duocuc.cl', curso: 'Aplicaciones Moviles 013D'},
    {nombre: 'Isabel', apellido: 'Cordero', correo: 'isabel.cordero@duocuc.cl', curso: 'Aplicaciones Moviles 014D'},
    {nombre: 'Pedro', apellido: 'Sánchez', correo: 'pedro.sanchez@duocuc.cl', curso: 'Aplicaciones Moviles 010D'},
    {nombre: 'Valeria', apellido: 'Rivas', correo: 'valeria.rivas@duocuc.cl', curso: 'Aplicaciones Moviles 011D'},
    {nombre: 'Martín', apellido: 'Vásquez', correo: 'martin.vasquez@duocuc.cl', curso: 'Aplicaciones Moviles 012D'}
]

  constructor() { }

  getAlumno(): Alumno[] {
    return this.alumnos;
  }
}
