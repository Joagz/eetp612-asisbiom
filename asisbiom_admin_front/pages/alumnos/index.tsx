import { MainLayout, Overline, Paragraph, Title } from "@/components";
import Curso from "@/interface/Curso";
import { Edit, SearchOff, Visibility } from "@mui/icons-material";
import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";

const HomeAlumnos = () => {
  const [cursos, setCursos] = useState<Curso[]>();

  useMemo(() => {
    axios
      .get<Curso[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/curso`)
      .then((res) => {
        setCursos(res.data);
      });
  }, []);

  return (
    <MainLayout title={"Alumnos"}>
      <article className="pt-20 px-6 w-full flex justify-center gap-8">
        <section className="flex flex-col gap-8 w-full *:md:w-1/2 items-center">
          <Title>Alumnos - Cursos</Title>
          <Overline>Listado de cursos de la Institución</Overline>
          {cursos?.length == 0 && (
            <Chip
              color="warning"
              label="Oops! no se encontraron cursos..."
              size="medium"
              variant="outlined"
              className="py-4"
              icon={<SearchOff color="warning"></SearchOff>}
            ></Chip>
          )}

          {cursos && cursos?.length > 0 && (
            <>
              <Paragraph>
                Podés editar con el ícono del <Edit fontSize="small" /> o
                consultar el listado de alumnos y sus asistencias hoy en{" "}
                <Visibility fontSize="small" />.
              </Paragraph>

              <TableContainer>
                <Table
                  className="w-full"
                  sx={{
                    [`& .${tableCellClasses.root}`]: {
                      borderBottom: "none",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Curso</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cursos?.map((curso, key) => {
                      return (
                        <>
                          <TableRow
                            key={key}
                            className={`${
                              cursos[key + 1] &&
                              cursos[key + 1].curso > curso.curso &&
                              "border-b"
                            }`}
                          >
                            <TableCell className="w-full">
                              {curso.curso} {curso.division.toUpperCase()}
                            </TableCell>
                            <TableCell className="flex">
                              <IconButton
                                href={`/alumnos/curso/${curso.curso}${curso.division}`}
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton
                                href={`/alumnos/curso/editar/${curso.curso}${curso.division}`}
                              >
                                <Edit />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </section>
      </article>
    </MainLayout>
  );
};

export default HomeAlumnos;
