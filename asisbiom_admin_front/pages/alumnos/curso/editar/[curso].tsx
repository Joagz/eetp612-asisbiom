import { MainLayout, Overline } from "@/components";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Curso from "@/interface/Curso";
import { useApi } from "@/hooks/useApi";
import Alumno from "@/interface/Alumno";
import { ArrowBack, Visibility, Save, Delete } from "@mui/icons-material";
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
  TextField,
  Typography,
} from "@mui/material";

const editCurso = ({
  data,
}: {
  data: { curso: string; id: number; division: string };
}) => {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [toDelete, setToDelete] = useState<number[]>([]);
  const [throwAlert, setThrowAlert] = useState<{
    status: boolean;
    message: string;
    response: boolean;
    alumnoId: number;
  }>();

  useMemo(() => {
    useApi<Curso>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/curso/${data.curso}/${data.division}`,
    }).then((res) => {
      useApi<[]>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/estadistica/${data.id}`,
      }).then((alumnoRes) => {
        setAlumnos(alumnoRes.data);
      });
    });
  }, []);

  // TODO: CRUD
  function deleteAlumno(alumno: number) {
    if (toDelete.find((a) => a == alumno) == null) {
      setThrowAlert({
        status: true,
        message:
          "Borrando alumno " +
          alumnos[alumno].nombreCompleto +
          "... ¿Está seguro?",
        response: false,
        alumnoId: alumno,
      });
    }
  }

  useEffect(() => {
    if (throwAlert?.response)
      setToDelete(toDelete.concat([...toDelete, throwAlert?.alumnoId]));
  }, [throwAlert]);

  function editCurso() {
    toDelete.forEach((alumno) => {
      useApi({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/curso/remover/${alumno}`,
        method: "DELETE",
      }).then((res) => console.log(res));
    });
  }

  function editAlumno(row: number, retirado: boolean, tardanza: boolean) {
    // Editar el estado de alumnos
    let edit = alumnos[row];
    edit.tardanza = tardanza;
    edit.retirado = retirado;
    const newArr: any[] = [
      ...alumnos.slice(0, row),
      edit,
      ...alumnos.slice(row + 1, alumnos.length - 1),
    ];
    setAlumnos(newArr);
  }

  return (
    <MainLayout title="Curso">
      {throwAlert?.status && (
        <div className="absolute flex gap-3 justify-center items-center flex-col z-100 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 p-8 bg-white shadow-sm border">
          <Typography>{throwAlert.message}</Typography>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setThrowAlert({
                  message: throwAlert.message,
                  status: false,
                  response: true,
                  alumnoId: throwAlert.alumnoId,
                });
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

          <Button
            className="w-fit"
            variant="contained"
            color="success"
            size="large"
            onClick={() => editCurso()}
            endIcon={<Save />}
          >
            Guardar cambios
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
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumnos.map((row: any, index: number) => (
                    <TableRow
                      key={index}
                      className={`${
                        toDelete.find((a) => a == index) != null
                          ? "bg-red-300"
                          : ""
                      }`}
                    >
                      <TableCell>{row.nombreCompleto}</TableCell>
                      <TableCell>{row.presente ? "Sí" : "No"}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          disabled={
                            !row.presente ||
                            toDelete.find((a) => a == index) != null
                          }
                          className="m-0"
                          color={row.tardanza ? "error" : "success"}
                          size="small"
                          variant="contained"
                          onClick={() =>
                            editAlumno(index, row.retirado, !row.tardanza)
                          }
                        >
                          {row.tardanza ? "Sí" : "No"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          disabled={
                            !row.presente ||
                            toDelete.find((a) => a == index) != null
                          }
                          className="m-0"
                          color={row.retirado ? "error" : "success"}
                          size="small"
                          variant="contained"
                          onClick={() =>
                            editAlumno(index, !row.retirado, row.tardanza)
                          }
                        >
                          {row.retirado ? "Sí" : "No"}
                        </Button>
                      </TableCell>
                      <TableCell>{row.diasHabiles}</TableCell>
                      <TableCell>{row.inasistencias1}</TableCell>
                      <TableCell>{row.inasistencias2}</TableCell>
                      <TableCell>{row.inasistencias3}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => deleteAlumno(index)}
                          color="error"
                        >
                          <Delete />
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

export async function getServerSideProps(context: any) {
  const { curso: cursoStr } = context.query;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/curso/${cursoStr?.slice(
        0,
        1
      )}/${cursoStr?.slice(1)}`
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

function AlumnoRow({ row }: any) {
  const [alumno, setAlumno] = useState({
    tardanza: row.tardanza,
    retirado: row.retirado,
  });

  return (
    <>
      <TableCell>
        <TextField value={row.nombreCompleto}>{row.nombreCompleto}</TextField>
      </TableCell>
      <TableCell>{row.presente ? "Sí" : "No"}</TableCell>
      <TableCell>{alumno.tardanza ? "Sí" : "-"}</TableCell>
      <TableCell>{alumno.retirado ? "Sí" : "-"}</TableCell>
      <TableCell>{row.diasHabiles}</TableCell>
      <TableCell>{row.inasistencias1}</TableCell>
      <TableCell>{row.inasistencias2}</TableCell>
      <TableCell>{row.inasistencias3}</TableCell>
    </>
  );
}

export default editCurso;
