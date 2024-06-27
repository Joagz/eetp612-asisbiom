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
import Curso from "@/interface/Curso";
import { useApi } from "@/hooks/useApi";

const listCurso = ({ data }: { data: { curso: string, id: number, division: string } }) => {
  const [alumnos, setAlumno] = useState<[]>([]);

  useMemo(() => {
    useApi<Curso>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/curso/${data.curso}/${data.division}` })
      .then((res) => {
        useApi<[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/estadistica/${data.id}` })
          .then((alumnoRes) => {
            setAlumno(alumnoRes.data);
          });
      });
  }, []);



  return (
    <MainLayout title="Curso">
      <article className="py-20 px-6 flex flex-col gap-8">
        <IconButton href="/alumnos" className="w-fit"><ArrowBack></ArrowBack></IconButton>
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
                    <TableCell><b>Curso: {data.curso}</b></TableCell>
                    <TableCell><b>División: {data.division}</b></TableCell>
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
                  {alumnos.map((row: any, index) => (
                    <TableRow key={index}>
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

export async function getServerSideProps(context: any) {
  const { curso: cursoStr } = context.query;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/curso/${cursoStr?.slice(0, 1)}/${cursoStr?.slice(1)}`
    );
    const data = res.data;
    console.log(data);
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching curso data:", error);
    return {
      notFound: true,
    };
  }
}

export default listCurso;
