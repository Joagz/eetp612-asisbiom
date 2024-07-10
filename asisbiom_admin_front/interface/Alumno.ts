import Curso from "./Curso";

export default interface Alumno {
  id: number;
  curso: Curso;
  nombreCompleto: string;
  telefono: string;
  correoElectronico: string;
  dni: string;
}

