import { Dispatch, SetStateAction } from "react";

import { MenuRounded } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { SideMenu } from "./SideMenu";
import Link from "next/link";

type Props = {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export const NavBar = ({ menuOpen, setMenuOpen }: Props) => {
  return (
    <nav className={` fixed top-0 left-0 flex flex-col w-full z-[100]`}>
      <AppBar className="relative z-100 bg-white p-2">
        <Toolbar variant="dense" className="flex gap-2 justify-center items-center">
          <IconButton
            color="inherit"
            size="large"
            className="text-black"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MenuRounded />
          </IconButton>
          <Link className="text-black" href="/">ASISBIOM</Link>
          <div className="flex-1"></div>
          <Button
            color="info"
            size="large"
            variant="outlined"
            href="/signin"
          >
            Iniciar Sesión
          </Button>

        </Toolbar>
      </AppBar>
      {menuOpen && <SideMenu />}
      {menuOpen && (
        <div
          onClick={() => {
            if (menuOpen) setMenuOpen(false);
          }}
          className="absolute left-[17.5em] w-full h-screen z-[1000]"
        ></div>
      )}
    </nav>
  );
};
