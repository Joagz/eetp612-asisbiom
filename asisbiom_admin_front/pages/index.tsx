import { Open_Sans } from "next/font/google";
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ArrowDownwardRounded,
  ArrowDropDown,
  ArrowDropUp,
  MenuRounded,
} from "@mui/icons-material";
import { useState } from "react";
import { SideMenu } from "@/components";

const open_sans = Open_Sans({ subsets: ["latin"], weight: "variable" });

export default function Home() {
  // Estados
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 flex flex-col w-full">
        <AppBar color="primary" className="relative">
          <Toolbar variant="dense">
            <IconButton edge="start" onClick={() => setMenuOpen(!menuOpen)}>
              <MenuRounded className="text-white" />
            </IconButton>
          </Toolbar>
        </AppBar>
        {menuOpen && <SideMenu />}
      </nav>
      <main
        className={`${
          menuOpen && "pl-[17.5em]"
        } flex flex-row justify-start items-start p-4 pt-20 w-full`}
      >
        <article className="flex-grow p-4">
          <Typography
            className={`${open_sans.className} text-lg text-justify`}
            fontWeight={400}
            variant="overline"
          >
            E.E.T.P N°612 "Eudocio de los Santos Giménez"
          </Typography>
          <Typography className="text-sm text-gray-600" variant="caption">
            Coronda, Santa Fe, Argentina.
          </Typography>

          <Typography
            className={`${open_sans.className} text-6xl`}
            fontWeight={600}
            variant="h1"
          >
            ASISBIOM
          </Typography>
          <Typography
            className={`${open_sans.className} text-blue-600`}
            fontWeight={500}
            variant="subtitle1"
          >
            Sistema de Asistencia Biométrica
          </Typography>

          <Typography variant="body1" className="text-xs" align="justify">
            El presente proyecto es desarrollado en una institución educativa
            con un número muy elevado de alumnos y que cuenta solo con un
            preceptor por turno. A raíz de esto, surgió la problemática de la
            ineficiencia y sobrecarga que se generaba hacia los preceptores y el
            equipo directivo. Se propuso una solución basada en una toma de
            asistencia de forma automática mediante datos biométricos,
            específicamente una huella dactilar.
          </Typography>
        </article>
        <aside className="flex-1 p-4">
          <Typography
            className={`${open_sans.className} text-lg text-justify`}
            fontWeight={400}
            variant="overline"
          >
            Bibliografía
          </Typography>
          <Typography variant="body1" className="text-xs" align="justify">
            Arduino: https://www.arduino.cc/ 
            Spring Framework: https://spring.io/ React.js: https://es.react.dev/ 
            Repositorio de Git (aplicación web): https://github.com/Joagz/fingerprint-system-iot 
            Repositorio de Git (código Arduino): https://github.com/Joagz/esp32-mqtt-fingerprint
          </Typography>
        </aside>
      </main>
    </>
  );
}
