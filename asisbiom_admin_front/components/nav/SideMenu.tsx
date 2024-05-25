import { DropdownBtn, NavButton } from "../buttons";

type Props = {};

export function SideMenu({}: Props) {
  return (
    <div className="w-[15em] h-screen relative bg-white shadow-lg border flex flex-col z-50">
      <NavButton href="/">Inicio</NavButton>
      <DropdownBtn title="Alumnos">
        <NavButton href="/alumnos/registrar">Registrar</NavButton>
        <DropdownBtn href="/alumnos/manana" title="Turno Mañana">
          <NavButton href="/alumnos/manana/4/A">4to A</NavButton>
        </DropdownBtn>
        <DropdownBtn href="/alumnos/tarde" title="Turno Tarde">
          <NavButton href="/alumnos/manana/4/C">4to C</NavButton>
        </DropdownBtn>
      </DropdownBtn>
      <NavButton href="/">Resúmenes</NavButton>
      <NavButton href="/">Inasistencias</NavButton>
      <NavButton href="/info">Acerca de</NavButton>
    </div>
  );
}
