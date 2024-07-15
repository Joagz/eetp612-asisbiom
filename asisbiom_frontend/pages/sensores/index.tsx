import { Card, CardContainer, PrincipalLayout } from "@/components";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useApi } from "@/hooks/useApi";

type Props = {};

const InicioSensores = (props: Props) => {
  const [sensors, setSensors] = useState<any[]>([]);

  useMemo(() => {
    useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/sensor` })
      .then((res) => setSensors(res.data));
  }, []);
  
  return (
    <PrincipalLayout justify="start" title={"Inicio"}>
      <div className="text-center lg:text-2xl pb-3">
        <h1 className="font-black text-2xl lg:text-5xl">Sensores</h1>
        <p>Sensores conectados en la institución.</p>
      </div>
      <div className="flex flex-1 w-full">
        <CardContainer cols={(sensors.length >= 3 && 3) || sensors.length}>
          {sensors.map((sensor) => (
            <Card
              key={sensor.id}
              href={`/sensores/${sensor.id}`}
              title={"SENSOR N." + sensor.id}
              info={sensor.ubicacion}
            />
          ))}
        </CardContainer>
      </div>
    </PrincipalLayout>
  );
};

export default InicioSensores;
