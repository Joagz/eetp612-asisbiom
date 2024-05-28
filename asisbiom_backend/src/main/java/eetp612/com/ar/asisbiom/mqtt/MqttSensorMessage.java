/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MqttSensorMessage {
    
    private String sensorId;
    private Integer idAlumno;
    private Integer accion;
    // Podríamos incluir algo que ayude a verificar la integridad del mensaje

}
