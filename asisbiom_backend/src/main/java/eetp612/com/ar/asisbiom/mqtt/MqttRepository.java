/*
 * Autor: Joaquín Gómez 
 * EETP N.612 "Eudocio de los Santos Giménez", Coronda, Santa Fe
 */
package eetp612.com.ar.asisbiom.mqtt;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MqttRepository extends JpaRepository<Sensor, Integer> {
    List<Sensor> findBySensorId(String sensorId);
}
