import { DropdownBtn, NavButton } from "../buttons";

export function SideMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="w-[17.5em] gap-2 h-screen relative bg-white shadow-lg border flex flex-col z-50 px-4">
      <div className="h-2"></div>
      <NavButton href="/">Inicio</NavButton>
      {isLoggedIn && (
        <>
          <DropdownBtn title="Alumnos">
            <NavButton href="/alumnos">Cursos</NavButton>
            <NavButton href="/alumnos/registrar">Registrar</NavButton>
            <NavButton href="/alumnos/listado">Buscar Alumno</NavButton>
          </DropdownBtn>
          <DropdownBtn title="Docentes">
            <NavButton href="/docentes">Listado</NavButton>
            <NavButton href="/docentes/autorizar">Autorizar</NavButton>
          </DropdownBtn>
          <NavButton href="/nota/listado">Notas</NavButton>
        </>
      )}
      <NavButton href="/stats">Estadisticas</NavButton>
      <NavButton href="/info">Acerca de</NavButton>
    </div>
  );
}
