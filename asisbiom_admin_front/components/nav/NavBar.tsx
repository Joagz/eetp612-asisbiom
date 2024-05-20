import { Dispatch, SetStateAction } from "react";

import { MenuRounded } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import { SideMenu } from "./SideMenu";

type Props = {
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>
};

export const NavBar = ({menuOpen, setMenuOpen}: Props) => {

  return (
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
  );
};
