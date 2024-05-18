package eetp612.com.ar.asisbiom.general;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.experimental.UtilityClass;

@UtilityClass
public class DateUtils {

    public static Integer getDay() {
        return LocalDate.now().getDayOfWeek().getValue();
    }

    public static boolean isTimeBefore(LocalTime a, LocalTime b) {
        return a.isBefore(b);
    }

}
