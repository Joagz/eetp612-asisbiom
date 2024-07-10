import { MainLayoutFixedHeight, Paragraph, Title } from "@/components"
import { useApi } from "@/hooks";
import Alumno from "@/interface/Alumno";
import { Delete, Visibility } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { useMemo, useState } from "react";
interface Nota {
  id: number,
  asunto: string,
  contenido: string,
  alumno: Alumno,
  fecha: string,
  vencimiento: string
};

export function listado() {

  const [notasData, setNotasData] = useState<Nota[]>([]);

  useMemo(() => {
    useApi<Nota[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/nota` }).then(res => setNotasData(res.data));
  }, [])

  return (
    <MainLayoutFixedHeight title="Notas">
      <Title>Lista de Notas</Title>
      <Paragraph>Cuya fecha de vencimiento no concluye aún.</Paragraph>
      <div className="w-full p-8">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="bg-slate-50 font-bold">Asunto</TableCell>
                <TableCell className="bg-slate-50 font-bold">Contenido</TableCell>
                <TableCell className="bg-slate-50 font-bold">Fecha Creación</TableCell>
                <TableCell className="bg-slate-50 font-bold">Fecha Vencimiento</TableCell>
                <TableCell className="bg-slate-100 font-bold">Alumno</TableCell>
                <TableCell className="bg-slate-100 font-bold"></TableCell>
                <TableCell className="bg-slate-50 font-bold">Acciones</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-slate-50"></TableCell>
                <TableCell className="bg-slate-50"></TableCell>
                <TableCell className="bg-slate-50">(dd/mm/aaaa)</TableCell>
                <TableCell className="bg-slate-50">(dd/mm/aaaa)</TableCell>
                <TableCell className="bg-slate-100">DNI</TableCell>
                <TableCell className="bg-slate-100">Nombre</TableCell>
                <TableCell className="bg-slate-50"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notasData.length == 0 &&
                <TableRow key={0}>
                  <TableCell>No se han escrito notas aún.</TableCell>
                </TableRow>
              }
              {notasData.map((row: Nota) => (
                <TableRow key={row.id}>
                  <TableCell>{row.asunto}</TableCell>
                  <TableCell>{row.contenido.substring(0, 20)}...</TableCell>
                  <TableCell>{row.fecha[2]} / {row.fecha[1]} / {row.fecha[0]} </TableCell>
                  <TableCell>{row.vencimiento[2]} / {row.vencimiento[1]} / {row.vencimiento[0]} </TableCell>
                  <TableCell className="bg-slate-100">{row.alumno.dni}</TableCell>
                  <TableCell className="bg-slate-100">{row.alumno.nombreCompleto}</TableCell>
                  <TableCell className="bg-slate-50 flex justify-around">
                    <IconButton title="Ver nota" className="hover:text-blue-600"><Visibility /></IconButton>
                    <IconButton title="Eliminar" className="hover:text-red-600"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </MainLayoutFixedHeight >
  )
}

export default listado
