import React, { useMemo, useState } from "react";
import { MainLayoutFixedHeight, Paragraph, Title } from "../../components";
import Alumno from "../../interface/Alumno";
import { useApi } from "../../hooks";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Asistencia from "@/interface/Asistencia";

export function AlumnoById({ id }: { id: number }) {
  const [alumno, setAlumno] = useState<Alumno>();
  const [asistencias, setAsistencias] = useState<Asistencia[]>();
  const router = useRouter();

  useMemo(() => {
    useApi<Alumno>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/${id}`,
    }).then((res) => setAlumno(res.data));
    useApi<Asistencia[]>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/asistencia/${id}`,
    }).then((res) => setAsistencias(res.data));
  }, []);

  return (
    <MainLayoutFixedHeight title="">
      <Title>{alumno?.nombreCompleto}</Title>
      <div className="flex flex-col gap-4">
        <Paragraph>
          Correo Electrónico: {alumno?.correoElectronico || "Nulo"}
        </Paragraph>
        <Paragraph>DNI: {alumno?.dni}</Paragraph>
        <Paragraph>Teléfono: {alumno?.telefono || "Nulo"}</Paragraph>
        {alumno?.curso && (
          <Paragraph>
            Curso: {alumno?.curso.curso} {alumno?.curso.division}
          </Paragraph>
        )}
        {!alumno?.curso && <Paragraph>Curso no asignado</Paragraph>}
        <Paragraph>ID: {alumno?.id}</Paragraph>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            router.back();
          }}
        >
          Atrás
        </Button>
      </div>
      <Title>Asistencias</Title>
      <div className="w-full flex flex-col gap-2 p-6 items-center">
        {asistencias?.map((asistencia) => (
          <Card
            className="w-full sm:w-1/2 flex justify-between"
            key={asistencia.id}
          >
            <CardContent>
              <Typography fontWeight={800}>
                {asistencia.dia} {asistencia.fecha.toString()}
              </Typography>
              {asistencia.horarioEntrada && (
                <Typography>
                  <b>Entrada:</b> {asistencia.horarioEntrada.toString()}
                </Typography>
              )}
              {asistencia.horarioRetiro && (
                <Typography>
                  <b>Salida:</b> {asistencia.horarioRetiro.toString()}
                </Typography>
              )}
              <Typography>
                <b>Retirado:</b> {asistencia.retirado ? "SI" : "NO"}
              </Typography>
              {asistencia.razonRetiro && (
                <Typography>
                  <b>Razón del retiro:</b> {asistencia.razonRetiro}
                </Typography>
              )}
              <Typography>
                <b>Tardanza:</b> {asistencia.tardanza ? "SI" : "NO"}
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: "25%" }}
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/image/${alumno?.id}/${asistencia.fecha}`}
              alt="Imagen del alumno"
            ></CardMedia>
          </Card>
        ))}
      </div>
    </MainLayoutFixedHeight>
  );
}

AlumnoById.getInitialProps = async ({ query }: any) => {
  const { id } = query;
  return { id };
};

export default AlumnoById;
