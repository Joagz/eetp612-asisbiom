import mqtt, { IClientOptions } from "mqtt";
import { list } from "postcss";
import { useEffect } from "react";

const options: IClientOptions = {
  keepalive: 30,
  clientId: process.env.NEXT_PUBLIC_MQTT_SERVER_URI,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  rejectUnauthorized: false,
};

export enum SensorActions {
  AUTH,
  REGISTER,
  CONFIRM,
  PING
}

export type MqttDataPacket = {
  sensorId: string;
  accion: SensorActions;
  idAlumno: number;
};

let _client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_SERVER_URI!, options);

function checkClient() {
  if (_client == null) {
    console.log("El cliente no fue inicializado! por favor usar 'useMqtt'");
    return false;
  }
  return true;
}

function publish(packet: MqttDataPacket) {
  if (!checkClient()) return;

  const finalPacket: string =
    packet.sensorId + "+" + packet.accion + "+" + packet.idAlumno;

  if (process.env.NEXT_PUBLIC_MQTT_TOPICS_SENSOR_IN)
    _client.publish(
      process.env.NEXT_PUBLIC_MQTT_TOPICS_SENSOR_IN,
      Buffer.from(finalPacket)
    );
  else
    console.log(
      "ERROR AL PUBLICAR AL SERVIDOR MQTT. (MQTT_TOPICS_SENSOR_IN no está definido en '.env')"
    );
}

function listenToSensor() {
  if (!checkClient()) return;

  if (process.env.NEXT_PUBLIC_MQTT_TOPICS_SENSOR_OUT)
    _client.subscribe(process.env.NEXT_PUBLIC_MQTT_TOPICS_SENSOR_OUT);
  else
    console.log(
      "ERROR AL SUSCRIBIRSE AL ESCUCHAR EL SENSOR. (MQTT_TOPICS_SENSOR_OUT no está definido en '.env')"
    );
}

_client.on("connect", () => {
  console.log("Ciente conectado");
  listenToSensor();
});

_client.on("error", (err: any) => {
  console.log(err);
});

export function useMqtt() {
  if (!checkClient()) return;
  return { publish };
}
