/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import jakarta.annotation.Nullable;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MqttSensorMessage {
    
    @Nullable
    private byte messageId[];
    private byte sensorId[];
    private byte idAlumno[];
    private byte accion[];
    // Podríamos incluir algo que ayude a verificar la integridad del mensaje

}
