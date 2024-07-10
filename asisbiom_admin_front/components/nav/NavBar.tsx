import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

import { ExitToApp, MenuRounded, Person } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { SideMenu } from "./SideMenu";
import Link from "next/link";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import axios from "axios";

type Props = {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export const NavBar = ({ menuOpen, setMenuOpen }: Props) => {
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoginPage, setLoginPage] = useState<boolean>(false);
  const [username, setUsername] = useState<string>();
  useEffect(() => {


    if (router.pathname == process.env.NEXT_PUBLIC_AUTH_PATH)
      setLoginPage(true);
    if (process.env.NEXT_PUBLIC_JWT_COOKIE) {
      let cookie = getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE);
      if (cookie) {
        setLoggedIn(true);
      }
      setUsername(getCookie("username"));
    }
  }, []);

  function logoutHandler() {
    if (process.env.NEXT_PUBLIC_JWT_COOKIE) {
      deleteCookie(process.env.NEXT_PUBLIC_JWT_COOKIE);
      setLoggedIn(false);
      router.push("/signin");
    }
  }

  return (
    <nav className={`fixed top-0 left-0 flex flex-col w-full z-[1000]`}>
      <AppBar className="relative z-100 bg-white p-2">
        <Toolbar
          variant="dense"
          className="flex gap-2 justify-center items-center"
        >
          <IconButton
            color="inherit"
            className="text-black"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MenuRounded />
          </IconButton>
          <Link className="text-black hover:text-blue-700 font-medium transition-all" href="/">
            ASISBIOM
          </Link>
          <div className="flex-1"></div>

          {!isLoginPage && (
            <>
              {isLoggedIn ? (
                <div className="flex gap-12">
                  <div onClick={() => logoutHandler()} className="flex gap-2 justify-center items-center h-10 p-2 px-4 
                  text-blue-50 bg-blue-500 rounded-[100px] hover:bg-blue-700 
                  hover:text-white cursor-pointer">
                    <Typography>{username}</Typography>
                    <ExitToApp />
                  </div>
                </div>
              ) : (
                <Button
                  color="info"
                  variant="outlined"
                  href="/signin"
                >
                  Iniciar Sesión
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      {menuOpen && <SideMenu isLoggedIn={isLoggedIn} />}
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
