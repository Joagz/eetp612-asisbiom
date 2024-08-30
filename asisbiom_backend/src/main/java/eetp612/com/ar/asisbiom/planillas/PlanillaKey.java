package eetp612.com.ar.asisbiom.planillas;

// En este caso cada valor tiene 9 bits, se reserva 1 bit para colocar
// si el alumno tiene o no taller (para procesamiento interno de las planillas)

public class PlanillaKey {
    public static final int AUSENTE     = 0b000000000000;
    public static final int PRESENTE    = 0b000000000001;
    public static final int TARDANZA    = 0b000000000010;
    public static final int JUSTIFICADO = 0b000000000100;
    public static final int CON_TALLER  = 0b111100000000;
    public static final int NO_HABIL    = 0b111111111111;
}
