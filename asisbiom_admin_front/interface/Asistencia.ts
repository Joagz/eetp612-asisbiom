export default interface Asistencia {
  id: number;
  alumno: any;
  asistencia: boolean;
  horarioEntrada: Date;
  horarioRetiro: Date;
  fecha: Date;
  tardanza: boolean;
  retirado: boolean;
  razonRetiro: string;
  dia: number;
}
