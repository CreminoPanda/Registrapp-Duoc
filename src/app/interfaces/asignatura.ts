import { Seccion } from 'src/app/interfaces/seccion';

export interface Asignatura {
  uid: string;
  nombre: string;
  nombreLowerCase?: string;
  secciones?: Seccion[];
  profesores?: string[];
}
