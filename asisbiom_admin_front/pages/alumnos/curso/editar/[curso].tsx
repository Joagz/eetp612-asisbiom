import { MainLayout, Overline } from "@/components";
import { useEffect, useState } from "react";
import Curso from "@/interface/Curso";
import { useApi } from "@/hooks/useApi";
import { ArrowBack, Visibility, Save, Delete, Edit } from "@mui/icons-material";
import {
  IconButton,
  Button,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Typography,
} from "@mui/material";
import AlumnoStats from "@/interface/AlumnoStats";
import MqttResponse from "@/interface/MqttResponse";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

const EditCurso = ({ curso }: { curso: string }) => {
  const [alumnos, setAlumnos] = useState<AlumnoStats[]>([]);
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false);
  const [throwAlert, setThrowAlert] = useState<{
    status: boolean;
    message: string;
    response?: boolean;
    alumnoId?: number;
    isJustOkeyAlert?: boolean;
    doSomething?: () => void;
  }>();
  const [data, setData] = useState<Curso>({} as Curso);
  const router = useRouter();

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

  // TODO: MUCHO TRABAJO!!!

  function asistirhandler(id: number) { }
  function tardanzahandler(id: number) { }
  function retirarhandler(id: number) { }
  function deletehandler(id: number) { }

  return (
    <MainLayout title={`Editar ${curso}`}>
      {throwAlert?.status && (
        <div className="z-[1000] absolute bg-slate-100 flex gap-3 justify-center items-center flex-col z-100 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 p-12 shadow-lg border-2 rounded-md">
          <Typography variant="h6">{throwAlert.message}</Typography>
          {throwAlert.isJustOkeyAlert ? (
            <Button
              variant="contained"
              onClick={() => {
                setThrowAlert({ status: false, message: throwAlert.message });
                if (throwAlert.doSomething) throwAlert.doSomething();
              }}
            >
              Aceptar
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setThrowAlert({
                    message: throwAlert.message,
                    status: false,
                    response: true,
                    alumnoId: throwAlert.alumnoId,
                  });
                  if (throwAlert.doSomething) throwAlert.doSomething();
                }}
                variant="contained"
                color="error"
              >
                Si
              </Button>
              <Button
                onClick={() => {
                  setThrowAlert({
                    message: throwAlert.message,
                    status: false,
                    response: false,
                    alumnoId: throwAlert.alumnoId,
                  });
                }}
                variant="contained"
                color="success"
              >
                No
              </Button>
            </div>
          )}
        </div>
      )}
      <article className="py-20 px-6 flex flex-col gap-8">
        <IconButton href="/alumnos" className="w-fit">
          <ArrowBack></ArrowBack>
        </IconButton>
        <Overline>Editar {`${data.curso}° '${data.division}'`}</Overline>
        <div className="flex gap-8">
          <Button
            className="w-fit"
            variant="contained"
            color="primary"
            size="large"
            href={`/alumnos/curso/${data.curso}${data.division}`}
            endIcon={<Visibility />}
          >
            Ver Curso
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
                    <TableCell>Presente</TableCell>
                    <TableCell>Tardanza</TableCell>
                    <TableCell>Retirado</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumnos.map((row: AlumnoStats, index: number) => (
                    <TableRow
                      key={index}
                    >
                      <TableCell>{row.nombreCompleto}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          className="m-0"
                          color={row.presente ? "success" : "error"}
                          size="small"
                          variant="contained"
                          onClick={() => asistirhandler(row.id)}
                        >
                          {row.presente ? "Sí" : "No"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          disabled={
                            !row.presente
                          }
                          className="m-0"
                          color={row.tardanza ? "success" : "error"}
                          size="small"
                          variant="contained"
                          onClick={() =>
                            tardanzahandler(row.id)}
                        >
                          {row.tardanza ? "Sí" : "No"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          disabled={
                            !row.presente
                          }
                          className="m-0"
                          color={row.retirado ? "success" : "error"}
                          size="small"
                          variant="contained"
                          onClick={() =>
                            retirarhandler(row.id)}
                        >
                          {row.retirado ? "Sí" : "No"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => deletehandler(row.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          // TODO: crear pag. para editar
                          href={`/alumos/editar/${row.id}`}
                          color="inherit"
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
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

EditCurso.getInitialProps = async ({ query }: any) => {
  const { curso } = query;

  return { curso };
};
export default EditCurso;
