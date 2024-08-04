import { MainLayout, Overline, Paragraph, Title } from "@/components";
import { Card, CardContent, Paper, Typography } from "@mui/material";
import {
  AppRegistrationRounded,
  ChecklistRounded,
  ListRounded,
  Notes,
  People,
  Public,
  QueryStats,
  School,
  SchoolRounded,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useApi } from "@/hooks";

export function Home() {
  const [personal_presentes, setPersonal] = useState<number>(0);
  const [alumnos_presentes, setAlumnos] = useState<number>(0);
  const [showActions, setShowActions] = useState<boolean>(false);

  // const [alumnosPresentes, setAlumnosPresentes] = useState<number>(0);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_JWT_COOKIE &&
      getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
    )
      setShowActions(true);

    useApi<{ tipo: string, valor: number }>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/estadistica/cantidades/personal-presentes` }).then(
      res => setPersonal(res.data.valor)
    )

    useApi<{ tipo: string, valor: number }>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/estadistica/cantidades/alumnos-presentes` }).then(
      res => setAlumnos(res.data.valor)
    )
  }, []);

  return (
    <MainLayout title="Inicio">
      <article className="py-10 flex flex-col w-full items-center gap-8">
        <div className="flex-col bg-eetp relative text-white gap-8 py-12 w-full flex justify-center items-center">
          <div className="z-10 bg-black opacity-30 absolute left-0 top-0 w-full h-full"></div>
          <div className="z-10 flex flex-col items-center">
            <Overline>EETP N°612 "Eudocio de los Santos Giménez"</Overline>
            <Title className="text-center font-bold">
              Sistema de Asistencias Biométrico
            </Title>
          </div>
          <div className="z-10 flex flex-wrap gap-6 justify-center items-center mx-4">
            <Card component={Paper} className="w-24">
              <CardContent className="flex flex-col justify-center items-center">
                <School />
                <Overline>{alumnos_presentes}</Overline>
                <Typography fontSize={14} textAlign={"center"}>Alumnos presentes</Typography>
              </CardContent>
            </Card>
            <Card component={Paper} className="w-24">
              <CardContent className="flex flex-col justify-center items-center">
                <People />
                <Overline>{personal_presentes}</Overline>
                <Typography fontSize={14} textAlign={"center"}>Personal presente</Typography>
              </CardContent>
            </Card>
          </div>
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

          <div className={`z-[100] lg:w-auto w-full flex-col gap-6 ${showActions ? "flex" : "hidden"}`}>
            <a
              href="/alumnos"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <SchoolRounded></SchoolRounded>
              <Overline>Alumnos/Cursos</Overline>
            </a>
            <a
              href="/alumnos/listado"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <ChecklistRounded></ChecklistRounded>
              <Overline>Buscar Alumno</Overline>
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
          <div className={`z-[100] lg:w-auto w-full flex-col gap-6 ${!showActions ? "flex" : "hidden"}`}>
            <a
              href="/info"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <People />
              <Overline>Sobre Nosotros</Overline>
            </a>
            <a
              target="_blank"
              href="http://eetp612.com.ar/index.php"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <Public />
              <Overline>Sitio Web Oficial</Overline>
            </a>
            <a
              href="/estadistica"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <QueryStats />
              <Overline>Estadisticas</Overline>
            </a>
            <a
              target="_blank"
              href="https://docs.google.com/document/d/1Xg-surUUbUj96hIaZC7PVef1saWX045L6DwcApeRPzg/edit?usp=sharing"
              className="hover:bg-teal-200 transition-all w-full hover:scale-95 text-teal-900 rounded-md shadow flex gap-4 p-6 bg-slate-100"
            >
              <Notes />
              <Overline>Registro de Campo</Overline>
            </a>
          </div>

        </div>
      </article>
    </MainLayout>
  );
}
export default Home;
