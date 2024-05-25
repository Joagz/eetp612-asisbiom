package eetp612.com.ar.asisbiom.alumnos;

import eetp612.com.ar.asisbiom.cursos.Curso;

public record AlumnoDto(
        String nombreCompleto,
        Curso curso,
        char division,
        int turno,
        String dni) {
    public Alumno toAlumno() {
        Alumno alumno = new Alumno();
        alumno.setCurso(this.curso());
        alumno.setDni(this.dni());
        alumno.setNombreCompleto(this.nombreCompleto());
        return alumno;
    }
}
