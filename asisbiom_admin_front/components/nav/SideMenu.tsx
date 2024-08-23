import { ArrowRightAltOutlined, BarChart, Call, Face, Help, HelpCenter, Home, Info, LiveHelp, Notes, School, Sensors, Settings } from "@mui/icons-material";
import { DropdownBtn, NavButton } from "../buttons";

export function SideMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="w-[17.5em] gap-2 h-screen relative bg-white shadow-lg border flex flex-col z-50 px-4">
      <div className="h-2"></div>
      <NavButton icon={<Home />} href="/">Inicio</NavButton>
      {isLoggedIn && (
        <>
          <DropdownBtn icon={<Face />} title="Alumnos">
            <NavButton icon={<ArrowRightAltOutlined />} href="/alumnos">Cursos</NavButton>
            <NavButton icon={<ArrowRightAltOutlined />} href="/alumnos/registrar">Registrar</NavButton>
            <NavButton icon={<ArrowRightAltOutlined />} href="/alumnos/listado">Buscar Alumno</NavButton>
          </DropdownBtn>
          <DropdownBtn icon={<School />} title="Docentes">
            <NavButton icon={<ArrowRightAltOutlined />} href="/docentes">Listado</NavButton>
            <NavButton icon={<ArrowRightAltOutlined />} href="/docentes/autorizar">Autorizar</NavButton>
          </DropdownBtn>
          <DropdownBtn icon={<Sensors />} title="Sensor">
            <NavButton icon={<ArrowRightAltOutlined />} href="/sensor">Listado</NavButton>
            <NavButton icon={<ArrowRightAltOutlined />} href="/sensor/autorizar">Autorizar</NavButton>
          </DropdownBtn>
          <NavButton icon={<Notes />} href="/nota/listado">Notas</NavButton>
          <NavButton icon={<BarChart />} href="/stats">Estadisticas</NavButton>
          <NavButton icon={<Call />} href="/alumnos/reportes">Reportes recibidos</NavButton>
        </>
      )}
      <NavButton icon={<Help />} href="/reportar">Reportes y ayuda</NavButton>
      <NavButton icon={<Info />} href="/info">Acerca de</NavButton>
      {/* <NavButton icon={<Settings />} href="/config">Configuración</NavButton> */}
    </div>
  );
}
