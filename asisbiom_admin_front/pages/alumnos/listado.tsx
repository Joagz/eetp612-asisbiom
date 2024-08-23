import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  InputLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { MainLayout } from "@/components";
import axios from "axios";
import { useApi } from "@/hooks/useApi";
import { Delete, Edit, EditNote, NoteAdd, Visibility } from "@mui/icons-material";
import { useRouter } from "next/router";

type _alumno_filter = {
  nombre: string;
  curso?: string;
  division: string;
  dni: string;
  inasistencias: number[];
};

const Listado = () => {
  // Ejemplo de datos
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroDni, setFiltroDni] = useState("");
  const [filtroDivision, setFiltroDivision] = useState("");
  const [datos, setDatos] = useState<_alumno_filter[]>([]);
  const [datosFiltrados, setDatosFiltrados] = useState<_alumno_filter[]>([]);

  useMemo(() => {
    useApi
      <any[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/stats` })
      .then((res) => {
        const listado = res.data;
        setDatos(
          listado.map((stat) => {
            return {
              id: stat.alumno.id,
              nombre: stat.alumno.nombreCompleto,
              curso: stat.alumno.curso?.curso || "No asignado",
              division: stat.alumno.curso?.division || "No asignado",
              dni: stat.alumno.dni,
              diasHabiles: stat.diasHabiles,
              tardanzas: stat.tardanzas,
              retiros: stat.retiros,
              correoElectronico: stat.alumno.correoElectronico,
              telefono: stat.alumno.telefono,
              inasistencias: [
                stat.inasistencias1,
                stat.inasistencias2,
                stat.inasistencias3,
              ],
            };
          })
        );
      });
  }, []);

  function changeDatosFiltrados() {
    setDatosFiltrados(
      datos.filter(
        (data) =>
          data.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
          data.curso?.toString().toLowerCase().includes(filtroCurso.toLowerCase()) &&
          data.division.toLowerCase().includes(filtroDivision.toLowerCase()) &&
          data.dni.toLowerCase().includes(filtroDni.toLowerCase())
      )
    );
  }

  useEffect(() => {
    changeDatosFiltrados();
  }, [datos, filtroCurso, filtroDivision]);

  return (
    <MainLayout title="Alumnos - Listado">
      <article className="flex flex-col w-full px-6">
        <div className="h-20"></div>
        <div className="flex justify-start gap-4 flex-wrap">
          <TextField
            className="flex min-w-[200px] max-w-[300px]"
            label="Nombre y Apellido"
            variant="outlined"
            value={filtroNombre}
            onKeyPressCapture={(e: any) => {
              if (e.key === 'Enter') {
                changeDatosFiltrados();
              }
            }}
            onChange={(e) => {
              setFiltroNombre(e.target.value);
            }}
            style={{ marginBottom: "10px", width: "300px" }}
          />
          <TextField
            className="flex min-w-[200px] max-w-[300px]"
            label="DNI"
            variant="outlined"
            value={filtroDni}
            onKeyPress={(e: any) => {
              if (e.key === 'Enter')
                changeDatosFiltrados();
            }}
            onChange={(e) => {
              setFiltroDni(e.target.value);
            }}
            style={{ marginBottom: "10px", width: "300px" }}
          />
          <FormControl>
            <InputLabel id="curso-input">Curso</InputLabel>
            <Select
              className="flex min-w-[200px] max-w-[300px]"
              label="Curso"
              id="curso-input"
              variant="outlined"
              value={filtroCurso}
              onChange={(e) => {
                setFiltroCurso(e.target.value);
              }}
              style={{ marginBottom: "10px", width: "300px" }}
            >
              <MenuItem value={"1"}>1ero</MenuItem>
              <MenuItem value={"2"}>2do</MenuItem>
              <MenuItem value={"3"}>3ero</MenuItem>
              <MenuItem value={"4"}>4to</MenuItem>
              <MenuItem value={"5"}>5to</MenuItem>
              <MenuItem value={"6"}>6to</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="division-input">División</InputLabel>
            <Select
              className="flex min-w-[200px] max-w-[300px]"
              label="División"
              id="division-input"
              variant="outlined"
              value={filtroDivision}
              onChange={(e) => {
                setFiltroDivision(e.target.value);
              }}
              style={{ marginBottom: "10px", width: "300px" }}
            >
              <MenuItem value={"A"}>A</MenuItem>
              <MenuItem value={"B"}>B</MenuItem>
              <MenuItem value={"C"}>C</MenuItem>
              <MenuItem value={"D"}>D</MenuItem>
              <MenuItem value={"E"}>E</MenuItem>
            </Select>
          </FormControl>

        </div>
        <br />
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="font-bold">Curso</TableCell>
                <TableCell className="font-bold">División</TableCell>
                <TableCell className="font-bold">Nombre y Apellido/s</TableCell>
                <TableCell className="font-bold">DNI</TableCell>
                <TableCell className="font-bold">Días Hábiles</TableCell>
                <TableCell className="font-bold" colSpan={3}>
                  Inasistencias
                </TableCell>
                <TableCell>Tardanzas</TableCell>
                <TableCell>Retiros</TableCell>
                <TableCell>Acciones</TableCell>
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
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosFiltrados.map((fila: any, index: any) => (
                <TableRow key={index}>
                  <TableCell>{fila.curso}</TableCell>
                  {/* Reemplaza con el dato del curso */}
                  <TableCell>{fila.division}</TableCell>
                  {/* Reemplaza con el dato de la división */}
                  <TableCell>{fila.nombre}</TableCell>
                  <TableCell>{fila.dni}</TableCell>
                  <TableCell>{fila.diasHabiles}</TableCell>
                  <TableCell>{fila.inasistencias[0]}</TableCell>
                  <TableCell>{fila.inasistencias[1]}</TableCell>
                  <TableCell>{fila.inasistencias[2]}</TableCell>
                  <TableCell>{fila.tardanzas}</TableCell>
                  <TableCell>{fila.retiros}</TableCell>
                  <TableCell>
                    <IconButton href={`/nota/alumno/${fila.id}`} className="hover:text-yellow-600" title="Nueva Nota"><EditNote /></IconButton>
                    <IconButton href={`/alumnos/${fila.id}`} className="hover:text-blue-600" title="Más información"><Visibility /></IconButton>
                    <EliminarAlumno idAlumno={fila.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </article>
    </MainLayout>
  );
};

function EliminarAlumno({ idAlumno }: { idAlumno: number }) {
  const [open, setOpen] = React.useState(false);
  const { reload } = useRouter();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleElimination = () => {
    useApi<any>({ method: "DELETE", url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/${idAlumno}` })
      .then(res => { console.log(res.data) })
    reload();
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen} className="hover:text-red-600" title="Eliminar"><Delete /></IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Borrar alumno?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirme la eliminación del alumno. ESTA ACCIÓN ES PERMANENTE Y ELIMINARÁ LA
            HUELLA DIGITAL DEL ALUMNO DEL REGISTRO
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>CANCELAR</Button>
          <Button color="error" onClick={handleElimination} autoFocus>
            CONFIRMAR
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export default Listado;
