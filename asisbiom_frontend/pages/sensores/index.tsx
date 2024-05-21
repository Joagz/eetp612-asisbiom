import { Card, CardContainer, PrincipalLayout } from "@/components";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

type Props = {};

const InicioSensores = (props: Props) => {
  const [sensors, setSensors] = useState<any[]>([]);

  useMemo(() => {
    axios
      .get("http://localhost:8089/api/sensor")
      .then((res) => setSensors(res.data));
  }, []);

  return (
    (<PrincipalLayout justify="start" title={"Inicio"}>
      <div className="text-center lg:text-2xl pb-3">
        <h1 className="font-black text-2xl lg:text-5xl">Sensores</h1>
        <p>Sensores conectados en la institución.</p>
      </div>
      <div className="flex flex-1 w-full">
        <CardContainer>
          {sensors.map((sensor) => (
            <Card
              key={sensor.id}
              href={`/sensores/${sensor.sensorId}`}
              title={sensor.sensorId}
              info={sensor.ubicacion}
            />
          ))}
        </CardContainer>
      </div>
    </PrincipalLayout>)
  );
};

export default InicioSensores;
