import Alumno from "./Alumno";
import Curso from "./Curso";

export default interface ListAlumnosCurso {
  curso: Curso;
  alumnos: Alumno[];
}
