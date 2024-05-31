import { useEffect, useMemo, useState } from "react";
import { DropdownBtn, NavButton } from "../buttons";
import axios from "axios";

interface Curso {
  id: number;
  division: string;
  curso: number;
  turno: number;
}

export function SideMenu() {
  const [cursosManana, setCursosManana] = useState<string[]>([]);
  const [cursosTarde, setCursosTarde] = useState<string[]>([]);

  useEffect(() => {
    if (
      !localStorage.getItem("cursosManana") ||
      !localStorage.getItem("cursosTarde")
    ) {
      axios
        .get<Curso[][]>(`${process.env.NEXT_PUBLIC_API_URL}/api/curso/turno`)
        .then((response) => {
          const cursosManana: string[] = [];
          const cursosTarde: string[] = [];
          response.data[0].forEach((curso) => {
            cursosManana.push(curso.curso + " '" + curso.division + "'");
          });
          response.data[1].forEach((curso) => {
            cursosTarde.push(curso.curso + " '" + curso.division + "'");
          });
          localStorage.setItem("cursosManana", cursosManana.toString());
          localStorage.setItem("cursosTarde", cursosTarde.toString());

          setCursosTarde(cursosManana);
          setCursosManana(cursosManana);
        });
    } else {
      const cursosManana = localStorage.getItem("cursosManana");
      const cursosTarde = localStorage.getItem("cursosTarde");
      if (cursosManana && cursosTarde) {
        setCursosTarde(cursosTarde.split(","));
        setCursosManana(cursosManana.split(","));
      }
    }
  }, []);

  return (
    <div className="w-[17.5em] gap-2 h-screen relative bg-white shadow-lg border flex flex-col z-50 px-4">
      <div className="h-2"></div>
      <NavButton href="/">Inicio</NavButton>
      <DropdownBtn title="Alumnos">
      <NavButton href="/alumnos/registrar">Registrar</NavButton>
      <NavButton href="/alumnos/listado">Listado</NavButton>
        <DropdownBtn href="/alumnos/manana" title="Turno Mañana">
          {cursosManana.map((curso: any) => (
            <NavButton key={curso} href={`/alumnos/${curso}`}>
              {curso}
            </NavButton>
          ))}
        </DropdownBtn>
        <DropdownBtn href="/alumnos/tarde" title="Turno Tarde">
          {cursosTarde.map((curso: any) => (
            <NavButton key={curso} href={`/alumnos/${curso}`}>
              {curso}
            </NavButton>
          ))}
        </DropdownBtn>
      </DropdownBtn>
      <NavButton href="/">Asistencia Diaria</NavButton>
      <NavButton href="/">Estadisticas</NavButton>
      <NavButton href="/info">Acerca de</NavButton>
    </div>
  );
}
