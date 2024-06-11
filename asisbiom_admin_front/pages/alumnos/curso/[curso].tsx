import { MainLayout, Overline } from "@/components";
import { ArrowBack, Download, Edit } from "@mui/icons-material";
import {
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";

import Alumno from "@/interface/Alumno";
import Curso from "@/interface/Curso";

const byCurso = ({ cursoStr }: { cursoStr: string }) => {
  const [curso, setCurso] = useState<Curso>({} as Curso);
  const [alumnos, setAlumno] = useState<Alumno[]>([]);
  const numero = cursoStr?.slice(0, 1);
  const division = cursoStr?.slice(1);

  useMemo(() => {
    axios
      .get<Curso>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/curso/${numero}/${division}`
      )
      .then((res) => {
        axios
          .get<Alumno[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/${numero}/${division}`
          )
          .then((alumnoRes) => {
            setAlumno(alumnoRes.data);
            setCurso(res.data);
          });
      });
  }, []);

  // Datos de ejemplo para la tabla principal y especificaciones
  const attendanceData = [
    {
      fullName: "Juan Pérez",
      dni: "12345678",
      present: true,
      absentOrLate: "A",
      totalAbsences: 3,
      totalDays: 20,
    },
    {
      fullName: "María Gómez",
      dni: "87654321",
      present: false,
      absentOrLate: "T",
      totalAbsences: 5,
      totalDays: 20,
    },
    // Agregar más datos si es necesario
  ];

  return (
    <MainLayout title="Curso">
      <article className="py-20 px-6 flex flex-col gap-8">
        <IconButton href="/alumnos" className="w-fit"><ArrowBack></ArrowBack></IconButton>
        <Overline>
          Información de {`${cursoStr?.slice(0, 1)}° '${cursoStr?.slice(1)}'`}
        </Overline>
        <div className="flex gap-8">
          <Button
            className="w-fit"
            variant="contained"
            color="primary"
            size="large"
            href={`/alumnos/curso/editar/${cursoStr}`}
            endIcon={<Edit />}
          >
            Editar Curso
          </Button>

          <Button
            className="w-fit"
            variant="contained"
            color="success"
            size="large"
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/estadistica/download${curso.id}`}
            endIcon={<Download />}
          >
            Descargar
          </Button>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Curso:</TableCell>
                    <TableCell>División:</TableCell>
                    <TableCell>Fecha:</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre Completo</TableCell>
                    <TableCell>DNI</TableCell>
                    <TableCell>Presente</TableCell>
                    <TableCell>Ausente / Tardanza</TableCell>
                    <TableCell>Total Inasistencias</TableCell>
                    <TableCell>Días Hábiles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.dni}</TableCell>
                      <TableCell>{row.present ? "Sí" : "No"}</TableCell>
                      <TableCell>{row.absentOrLate}</TableCell>
                      <TableCell>{row.totalAbsences}</TableCell>
                      <TableCell>{row.totalDays}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </article>
    </MainLayout>
  );
};

export async function getServerSideProps(context: any) {
  const { curso: cursoStr } = context.query;

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/curso/${cursoStr?.slice(
      0,
      1
    )}/${cursoStr?.slice(1)}`
  );
  const curso = res.data;

  return {
    props: {
      cursoStr,
    },
  };
}

export default byCurso;
