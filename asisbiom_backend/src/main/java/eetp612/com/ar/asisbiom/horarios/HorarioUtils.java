package eetp612.com.ar.asisbiom.horarios;

import java.util.List;

import lombok.experimental.UtilityClass;

@UtilityClass
public class HorarioUtils {

    /*
     * Recibe la lista de horarios en los cuales el alumno NO asistió y la lista de
     * horarios totales.
     * 1 = clase
     * 2 = talleres
     * 3 = ed. física
     */
    public static float getValorInasistencia(List<Horario> noAsistido, List<Horario> totalHorarios) {

        float sumaFinal = 0;
        
        for (Horario h : noAsistido) {

            // si solo tiene clases la inasistencia es completa
            if (totalHorarios.size() == 1) {
                sumaFinal = 1;
                break;
            }

            switch (h.getClase()) {
                case 1:
                    sumaFinal += 1 / 2;
                    break;
                case 2:
                    sumaFinal += 1 / 2;
                case 3:
                    sumaFinal += 1 / 4;
                    break;
                default:
                    break;
            }

        }

        return sumaFinal;

    }

}
