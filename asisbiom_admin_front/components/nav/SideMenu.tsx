import { DropdownBtn, NavButton } from "../buttons";

export function SideMenu() {
  return (
    <div className="w-[17.5em] gap-2 h-screen relative bg-white shadow-lg border flex flex-col z-50 px-4">
      <div className="h-2"></div>
      <NavButton href="/">Inicio</NavButton>
      <DropdownBtn title="Alumnos">
        <NavButton href="/alumnos">Cursos</NavButton>
        <NavButton href="/alumnos/registrar">Registrar</NavButton>
        <NavButton href="/alumnos/listado">Listado</NavButton>
      </DropdownBtn>
      <NavButton href="/">Asistencia Diaria</NavButton>
      <NavButton href="/">Estadisticas</NavButton>
      <NavButton href="/info">Acerca de</NavButton>
    </div>
  );
}
