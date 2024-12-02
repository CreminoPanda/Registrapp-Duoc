export interface Seccion {
  uid: string;
  nombre: string;
  cupos: number;
  alumnos?: string[];
  asignaturaUid: string;
  profesorUid: string;
}
