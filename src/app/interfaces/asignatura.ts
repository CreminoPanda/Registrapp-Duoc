import { Seccion } from 'src/app/interfaces/seccion';
import { Profesor } from 'src/app/interfaces/profesor';

export interface Asignatura {
  uid: string;
  nombre: string;
  nombreLowerCase?: string;
  secciones?: Seccion[];
  profesores?: string[];
}
