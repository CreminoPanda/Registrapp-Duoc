export interface Seccion {
  uid: string;
  nombre: string;
  cupos: number;
  alumnos?: string[]; // UIDs de los alumnos asignados a la sección
}
