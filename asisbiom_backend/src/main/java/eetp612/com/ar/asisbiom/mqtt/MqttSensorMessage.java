/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import java.time.LocalTime;
import java.util.Date;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MqttSensorMessage {
    
    private String sensorId;
    private Integer idAlumno;
    private String action;
    private LocalTime time;
    private Date date;

}
