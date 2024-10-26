import { Seccion } from "src/app/interfaces/seccion";

export interface Asignatura {
    uid: string;
    nombre: string;
    secciones?: Seccion[]; // Lista de secciones de la asignatura
}