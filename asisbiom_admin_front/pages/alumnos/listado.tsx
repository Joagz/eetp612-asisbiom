import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { MainLayout } from "@/components";

const Listado = () => {
  // Ejemplo de datos
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroDni, setFiltroDni] = useState("");
  const [filtroDivision, setFiltroDivision] = useState("");

  const datos = [
    {
      curso: "2",
      division: "A",
      nombre: "Juan Perez",
      dni: "12345678",
      diasHabiles: 60,
      inasistencias: [2, 3, 1],
    },
    {
      curso: "1",
      division: "A",
      nombre: "María Gomez",
      dni: "87654321",
      diasHabiles: 60,
      inasistencias: [1, 2, 0],
    },
  ];
  
  const [datosFiltrados, setDatosFiltrados] = useState<any>(datos);

  function setFilter() {
    setDatosFiltrados(
      datos.filter(
        (data) =>
          data.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
          data.curso.toLowerCase().includes(filtroCurso.toLowerCase()) &&
          data.division.toLowerCase().includes(filtroDivision.toLowerCase()) &&
          data.dni.toLowerCase().includes(filtroDni.toLowerCase())
      )
    );
  }

  return (
    <MainLayout title="Alumnos - Listado">
      <article className="flex flex-col w-full">
        <div className="h-20"></div>
        <div className="flex justify-start gap-1 flex-wrap">
          <TextField
            className="flex-1 min-w-[200px]"
            label="Nombre y Apellido"
            variant="outlined"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            style={{ marginBottom: "10px", width: "300px" }}
          />
          <TextField
            className="flex-1 min-w-[200px]"
            label="DNI"
            variant="outlined"
            value={filtroDni}
            onChange={(e) => setFiltroDni(e.target.value)}
            style={{ marginBottom: "10px", width: "300px" }}
          />
          <FormControl>
            <InputLabel id="curso-input">Curso</InputLabel>
            <Select
              className="flex-1 min-w-[200px]"
              label="Curso"
              id="curso-input"
              variant="outlined"
              value={filtroCurso}
              onChange={(e) => setFiltroCurso(e.target.value)}
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
              className="flex-1 min-w-[200px]"
              label="División"
              id="division-input"
              variant="outlined"
              value={filtroDivision}
              onChange={(e) => setFiltroDivision(e.target.value)}
              style={{ marginBottom: "10px", width: "300px" }}
            >
              <MenuItem value={"A"}>A</MenuItem>
              <MenuItem value={"B"}>B</MenuItem>
              <MenuItem value={"C"}>C</MenuItem>
              <MenuItem value={"D"}>D</MenuItem>
              <MenuItem value={"E"}>E</MenuItem>
            </Select>
          </FormControl>
          <Button
            className="flex-1 h-[61.750px] min-w-[200px]"
            onClick={() => setFilter()}
            variant="contained"
          >
            Buscar
          </Button>{" "}
        </div>

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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </article>
    </MainLayout>
  );
};

export default Listado;
