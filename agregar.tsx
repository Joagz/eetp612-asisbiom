import React, { useState } from "react";
import axios from "axios";
import mqtt from "mqtt";

import "../css/Sensor.css";
import { InfoEscuela } from "../components";

const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

const options = {
  keepalive: 30,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
  rejectUnauthorized: false,
};

const client = mqtt.connect(process.env.REACT_APP_MQTT_URI, options);

client.on("connect", () => {
  console.log("Connected");
  client.subscribe("general");
});

export function Sensor() {
  const [id, setId] = useState(0);
  const [alumnoInfo, setAlumnoInfo] = useState({
    response: {
      dni: "",
      nombre_apellido: "",
      curso: "",
      division: "",
    },
  });

  client.on("message", (topic, message) => {
    const recv = message.toString();
    setId(recv);

    axios
      .get(`${process.env.REACT_APP_API_URI}/api/alumnos/${recv}`)
      .then((res) => {
        setAlumnoInfo(res.data);
        console.log(res.data);
      });

    console.log("Id recibida del sensor:", id);
  });

  return (
    <main className="mainContainer">
      <a href="/">
        <img className="arrowBack" src="/icons/back.svg" alt="arrowBack"></img>
      </a>
      <header className="infoContainer">
        <div className="innerInfoContainer">
          {alumnoInfo?.message === "OK" && <h1>Alumno encontrado!</h1>}
          <div>
            {alumnoInfo?.message !== "OK" && <h1>Esperando datos...</h1>}
            {alumnoInfo?.message !== "OK" && (
              <p>Por favor, inserte su dedo en el sensor.</p>
            )}
          </div>
          <div className="info">
            {alumnoInfo?.message === "OK" && (
              <>
                <p className="infoDni">DNI: {alumnoInfo.response.dni}</p>
                <h2 className="infoNombre">
                  Nombre: {alumnoInfo.response.nombre_apellido}
                </h2>
                <div className="infoCurso" style={{}}>
                  <p>Curso y Division:</p>{" "}
                  <p>
                    {alumnoInfo.response.curso} {alumnoInfo.response.division}
                  </p>
                </div>
              </>
            )}
            {alumnoInfo?.message === "NOT FOUND" && (
              <>
                <h1>
                  No hay ninguna huella con este ID ({alumnoInfo.response}).
                </h1>
                <a href="/registrar">Registrar alumno nuevo</a>
              </>
            )}
            {alumnoInfo == null && (
              <>
                <h1>No se han registrado datos desde el sensor.</h1>
                <a href="/registrar">Registrar alumno nuevo</a>
              </>
            )}
          </div>

          <InfoEscuela />
        </div>
      </header>
    </main>
  );
}
