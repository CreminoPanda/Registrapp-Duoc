import { Asignatura } from "../interfaces/asignatura";

export interface Profesor {
    uid: string;
    nombre: string;
    apellido: string;
    email: string;
    asignaturas?: Asignatura[]; // Lista de asignaturas que el profesor imparte
}