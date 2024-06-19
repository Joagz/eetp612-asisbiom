package eetp612.com.ar.asisbiom.horarios;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import lombok.experimental.UtilityClass;

@UtilityClass
public class HorarioUtils {

    public int getActualTrimestre() {
        LocalDate now = LocalDate.now();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd MM yyyy");
        String _1t = "31 05 " + LocalDate.now().getYear();
        String _2t = "30 08 " + LocalDate.now().getYear();
        String _3t = "22 11 " + LocalDate.now().getYear();

        System.out.println(_1t);
        System.out.println(_2t);
        System.out.println(_3t);

        LocalDate _1tDate = LocalDate.parse(_1t, dtf);
        LocalDate _2tDate = LocalDate.parse(_2t, dtf);
        LocalDate _3tDate = LocalDate.parse(_3t, dtf);

        if (now.isBefore(_1tDate))
            return 1;
        if (now.isBefore(_2tDate))
            return 2;
        if (now.isBefore(_3tDate))
            return 3;

        return 0;
    }

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

            sumaFinal += h.getValorInasistencia();

        }

        return sumaFinal;

    }

}
