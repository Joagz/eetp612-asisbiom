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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AlumnoStats from "@/interface/AlumnoStats";
import MqttResponse from "@/interface/MqttResponse";
import MqttResponseAsistenciaWrapper from "@/interface/MqttResponseAsistenciaWrapper";

const EditCurso = ({ curso }: { curso: string }) => {
  const [alumnos, setAlumnos] = useState<AlumnoStats[]>([]);
  const [data, setData] = useState<Curso>({} as Curso);
  const [retirarDialogOpen, setRetirarDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  function asistirhandler(alumno: AlumnoStats, index: number) {
    useApi<MqttResponseAsistenciaWrapper>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/asistir/${alumno.id}?set=true`, method: "POST" })
      .then(res => {
        if (res.data.response === MqttResponse.OK) {
          alumno.presente = true;
          setAlumnos([...alumnos.slice(0, index), alumno, ...alumnos.slice(index + 1, alumnos.length)]);
        }
      }
      )
  }

  function desasistirhandler(alumno: AlumnoStats, index: number) {
    useApi<MqttResponseAsistenciaWrapper>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/asistir/${alumno.id}?set=false`, method: "POST" })
      .then(res => {
        if (res.data.response === MqttResponse.OK) {
          alumno.presente = false;
          setAlumnos([...alumnos.slice(0, index), alumno, ...alumnos.slice(index + 1, alumnos.length)]);
        }
      }
      )
  }

  function tardanzahandler(alumno: AlumnoStats, index: number) {
    useApi<MqttResponseAsistenciaWrapper>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/tardanza/${alumno.id}?set=${!alumno.tardanza}`, method: "POST" })
      .then(res => {
        if (res.data.response === MqttResponse.OK) {
          alumno.tardanza = !alumno.tardanza;
          setAlumnos([...alumnos.slice(0, index), alumno, ...alumnos.slice(index + 1, alumnos.length)]);
        }
      }
      )
  }

  function retirarconfirmation() {
    if (!retirarDialogOpen)
      setRetirarDialogOpen(true);
  }

  function deleteconfirmation() {
    if (!deleteDialogOpen)
      setDeleteDialogOpen(true);
  }

  function retirarhandler(alumno: AlumnoStats, index: number) {

    useApi<MqttResponseAsistenciaWrapper>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/retirar/${alumno.id}`, method: "POST" })
      .then(res => {
        if (res.data.response === MqttResponse.OK) {
          alumno.retirado = true;
          setAlumnos([...alumnos.slice(0, index), alumno, ...alumnos.slice(index + 1, alumnos.length)]);
        }
      })

    setRetirarDialogOpen(false);
  }

  function deletehandler(alumno: AlumnoStats, index: number) {
    useApi<MqttResponseAsistenciaWrapper>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/remover/${alumno.id}`, method: "DELETE" })
      .then(res => {
        if (res.data.response === MqttResponse.OK) {
          setAlumnos([...alumnos.slice(0, index), ...alumnos.slice(index + 1, alumnos.length)]);
        }
      })

    setRetirarDialogOpen(false);

  }

  return (
    <MainLayout title={`Editar ${curso}`}>


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
                    <>
                      <ConfirmationDialog
                        title={"RETIRAR ALUMNO"}
                        content={"Esta acción es irreversible. Una vez que haya aceptado el estado del alumno no podrá ser cambiado."}
                        handleConfirm={() => retirarhandler(row, index)}
                        handleClose={() => setRetirarDialogOpen(false)}
                        open={retirarDialogOpen} />
                      <ConfirmationDialog
                        title={"REMOVER ALUMNO"}
                        content={"Esta acción es irreversible. Una vez que haya aceptado el estado del alumno no podrá ser cambiado."}
                        handleConfirm={() => deletehandler(row, index)}
                        handleClose={() => setDeleteDialogOpen(false)}
                        open={deleteDialogOpen} />
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
                            onClick={
                              row.presente ?
                                () => desasistirhandler(row, index)
                                : () => asistirhandler(row, index)}>
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
                              tardanzahandler(row, index)}
                          >
                            {row.tardanza ? "Sí" : "No"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Button
                            disabled={
                              !row.presente || row.retirado
                            }
                            className="m-0"
                            color={row.retirado ? "success" : "error"}
                            size="small"

                            variant="contained"
                            onClick={() =>
                              retirarconfirmation()}
                          >
                            {row.retirado ? "Sí" : "No"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => deleteconfirmation()}
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
                    </>

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

function ConfirmationDialog({ title, content, handleClose, handleConfirm, open }:
  { title: string, content: string, handleClose: () => void, handleConfirm: () => void, open: boolean }) {

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button variant="contained" color="inherit" onClick={handleClose}>CANCELAR</Button>
          <Button variant="contained" color="error" onClick={handleConfirm} autoFocus>
            CONFIRMAR
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

EditCurso.getInitialProps = async ({ query }: any) => {
  const { curso } = query;

  return { curso };
};
export default EditCurso;
