package eetp612.com.ar.asisbiom.general;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import lombok.experimental.UtilityClass;

@UtilityClass
public class DateUtils {

    public static Integer getDay() {
        return LocalDate.now().getDayOfWeek().getValue();
    }

    public static boolean isTimeBefore(LocalTime a, LocalTime b) {
        return a.isBefore(b);
    }

    public static long getDiasHabiles() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd MM yyyy");
        LocalDate actual = LocalDate.from(Instant.now());

        String string = (actual.getYear() + 1900) + " 03 04";
        LocalDate start = LocalDate.parse(string, dtf);
       
        System.out.println(string);
        
        long daysBetween = Duration.between(start, actual).toDays();
        return daysBetween;
    }

}
