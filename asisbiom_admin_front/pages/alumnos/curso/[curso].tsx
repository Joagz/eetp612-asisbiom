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
import { useEffect, useMemo, useState } from "react";
import Curso from "@/interface/Curso";
import { useApi } from "@/hooks/useApi";
import AlumnoStats from "@/interface/AlumnoStats";

const ListCurso = ({ curso }: { curso: string }) => {
  const [alumnos, setAlumnos] = useState<AlumnoStats[]>([]);
  const [data, setData] = useState<Curso>({} as Curso);

  useEffect(() => {
    const year = curso?.slice(0, 1);
    const division = curso?.slice(1, 2);

    useApi<Curso>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/curso/${year}/${division}`,
    }).then((res) => {
      setData(res.data);
      useApi<[]>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/estadistica/${res.data.id}`,
      }).then((alumnoRes) => {
        setAlumnos(alumnoRes.data);
      });
    });
  }, []);

  return (
    <MainLayout title={curso}>
      <article className="py-20 px-6 flex flex-col gap-8">
        <IconButton href="/alumnos" className="w-fit">
          <ArrowBack></ArrowBack>
        </IconButton>
        <Overline>
          Información de {`${data.curso}° '${data.division}'`}
        </Overline>
        <div className="flex gap-8">
          <Button
            className="w-fit"
            variant="contained"
            color="primary"
            size="large"
            href={`/alumnos/curso/editar/${data.curso}${data.division}`}
            endIcon={<Edit />}
          >
            Editar Curso
          </Button>

          <Button
            className="w-fit"
            variant="contained"
            color="success"
            size="large"
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/estadistica/descarga/${data.id}`}
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
                    <TableCell>
                      <b>Curso: {data.curso}</b>
                    </TableCell>
                    <TableCell>
                      <b>División: {data.division}</b>
                    </TableCell>
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
                    <TableCell>Presente</TableCell>
                    <TableCell>Tardanza</TableCell>
                    <TableCell>Retirado</TableCell>
                    <TableCell>Días Hábiles</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Inasistencias</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>1er Trimestre</TableCell>
                    <TableCell>2do Trimestre</TableCell>
                    <TableCell>3er Trimestre</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumnos.map((row: AlumnoStats) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.nombreCompleto}</TableCell>
                      <TableCell>{row.presente ? "Sí" : "No"}</TableCell>
                      <TableCell>{row.tardanza ? "Sí" : "-"}</TableCell>
                      <TableCell>{row.retirado ? "Sí" : "-"}</TableCell>
                      <TableCell>{row.diasHabiles}</TableCell>
                      <TableCell>{row.inasistencias1}</TableCell>
                      <TableCell>{row.inasistencias2}</TableCell>
                      <TableCell>{row.inasistencias3}</TableCell>
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
ListCurso.getInitialProps = async ({ query }: any) => {
  const { curso } = query;

  return { curso };
};

export default ListCurso;
