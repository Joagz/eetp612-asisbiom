import { Open_Sans } from "next/font/google";
import { MainLayout, Overline, Paragraph, Title } from "@/components";
import { Card, CardContent, Paper } from "@mui/material";
import {
  AppRegistrationRounded,
  ChecklistRounded,
  ListRounded,
  Man,
  People,
  SchoolRounded,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

export function Home() {
  const [cantidades, setCantidades] = useState<{
    cant_personal: string;
    cant_alumnos: string;
  }>({} as any);
  const [showActions, setShowActions] = useState<boolean>(false);

  const [alumnosPresentes, setAlumnosPresentes] = useState<number>(0);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_JWT_COOKIE &&
      getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
    )
      setShowActions(true);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/estadistica/cantidades`)
      .then((res) => {
        setCantidades({
          cant_personal: res.data.cantidadPersonal + "",
          cant_alumnos: res.data.cantidadAlumnos + "",
        });
      });

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/estadistica/cantidades/diaria`
      )
      .then((res) => {
        setAlumnosPresentes(res.data.cantidadAlumnos);
      });
  }, []);

  return (
    <MainLayout title="Inicio">
      <article className="py-10 flex flex-col w-full items-center gap-8">
        <div className="flex-col bg-eetp relative text-white gap-8 py-12 w-full flex justify-center items-center">
          <div className="z-10 bg-black opacity-30 absolute left-0 top-0 w-full h-full"></div>
          <div className="z-10 flex flex-col items-center">
            <Overline>Sistema de Asistencias Biométrico</Overline>
            <Title className="text-center font-bold">
              EETP N°612 "Eudocio de los Santos Giménez"
            </Title>
          </div>
          <div className="z-10 flex flex-wrap gap-6 justify-center items-center mx-4">
            <Card component={Paper} className="w-24">
              <CardContent className="flex flex-col justify-center items-center">
                <People></People>
                <Overline>{cantidades.cant_alumnos}</Overline>
                <Paragraph>Alumnos</Paragraph>
              </CardContent>
            </Card>
            <Card component={Paper} className="w-24">
              <CardContent className="flex flex-col justify-center items-center">
                <People></People>
                <Overline>{alumnosPresentes}</Overline>
                <Paragraph>Presentes</Paragraph>
              </CardContent>
            </Card>
            <Card component={Paper} className="w-24">
              <CardContent className="flex flex-col justify-center items-center">
                <Man></Man>
                <Overline>{cantidades.cant_personal}</Overline>
                <Paragraph>Personal</Paragraph>
              </CardContent>
            </Card>
          </div>{" "}
        </div>

        <div className="px-12 w-full flex-col flex lg:flex-row justify-center gap-7 items-start">
          <Card component={Paper}>
            <CardContent className="flex flex-col justify-center gap-2 flex-grow w-full">
              <Overline>Equipo Directivo</Overline>
              <Paragraph>
                <b>Director: </b>Héctor José Yasparra
              </Paragraph>
              <Paragraph>
                <b>Vicedirectores: </b>Sebastián Pisatti, Ricardo Restaldi
              </Paragraph>
              <Paragraph>
                <b>Secretaria: </b>Micaela Maradona
              </Paragraph>
              <Paragraph>
                <b>Prosecretarias: </b>Florencia Toneatti, Agostina Chiapello
              </Paragraph>
              <Paragraph>
                <b>Preceptoras: </b>Lorena De Oracio, Cecilia Gomez, Antonela
                Bortolotto, Natalí Arcando Romano
              </Paragraph>
              <br />
              <Overline>Información</Overline>
              <Paragraph>
                <b>Provincia:</b> Santa Fe
              </Paragraph>
              <Paragraph>
                <b>Ciudad:</b> Coronda
              </Paragraph>
              <Paragraph>
                <b>Modalidad:</b> TEIE ("Técnico en Equipos de Instalaciones
                Eléctricas")
              </Paragraph>
              <Paragraph>
                <b>Dirección:</b> Juan de Garay esquina Italia
              </Paragraph>
              <Paragraph>
                <b>Tipo de Turno:</b> Doble
              </Paragraph>
              <Paragraph>
                <b>Teléfono:</b> 0342-4910134
              </Paragraph>
              <Paragraph>
                <b>Correo:</b> eetp.612coronda@gmail.com
              </Paragraph>
            </CardContent>
          </Card>

          <div className={`lg:w-auto w-full flex-col gap-6 ${showActions ? "flex" : "hidden"}`}>
            <a
              href="/alumnos"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <SchoolRounded></SchoolRounded>
              <Overline>Alumnos/Cursos</Overline>
            </a>
            <a
              href="/alumnos/diario"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <ChecklistRounded></ChecklistRounded>
              <Overline>Asistencia diaria</Overline>
            </a>
            <a
              href="/alumnos/registrar"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <AppRegistrationRounded></AppRegistrationRounded>
              <Overline>Registrar alumno</Overline>
            </a>
            <a
              href="/alumnos/listado"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <ListRounded></ListRounded>
              <Overline>Listado</Overline>
            </a>
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
export default Home;
