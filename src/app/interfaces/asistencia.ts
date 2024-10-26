export interface Asistencia {
    uid: string;
    asignaturaUid: string;
    seccionUid: string;
    fecha: Date;
    estudiantes: { [estudianteUid: string]: boolean };
}