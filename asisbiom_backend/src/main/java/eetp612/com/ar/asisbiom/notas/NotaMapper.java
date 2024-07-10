package eetp612.com.ar.asisbiom.notas;

import java.time.LocalDate;

import eetp612.com.ar.asisbiom.alumnos.Alumno;
import lombok.experimental.UtilityClass;

@UtilityClass
public class NotaMapper {

    public static Nota map(NotaDto dto, Alumno alumno) {
        Nota nota = new Nota();
        nota.setAlumno(alumno);
        nota.setAsunto(dto.asunto());
        nota.setContenido(dto.contenido());
        nota.setFecha(LocalDate.now());
        nota.setNivel_urgencia(dto.nivel_alerta());
       
        LocalDate vencimiento = null;
        
        if (dto.vencimiento() > 0) {
            vencimiento = LocalDate.now().plusDays(dto.vencimiento());
        } 

        nota.setVencimiento(vencimiento);

        return nota;
    }

}
