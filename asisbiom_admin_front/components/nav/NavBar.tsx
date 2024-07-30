import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ExitToApp, MenuRounded, Notifications } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, Divider } from "@mui/material";
import { SideMenu } from "./SideMenu";
import Link from "next/link";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useApi } from "../../hooks";
import INotification from "@/interface/INotification";

type Props = {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export const NavBar = ({ menuOpen, setMenuOpen }: Props) => {
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoginPage, setLoginPage] = useState<boolean>(false);
  const [username, setUsername] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (router.pathname == process.env.NEXT_PUBLIC_AUTH_PATH)
      setLoginPage(true);
    if (process.env.NEXT_PUBLIC_JWT_COOKIE) {
      let cookie = getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE);
      if (cookie) {
        setLoggedIn(true);
        const email = getCookie("email");
        const username = getCookie("username");
        setUsername(username);

        // fetchear notificaciones
        useApi<INotification[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/notification/${email}` })
          .then(res => setNotifications(res.data));
      }
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
                <div className="flex gap-6 justify-center items-center">
                  <div className="flex gap-2 justify-center items-center">
                    <IconButton id="basic-button" onClick={handleClick}>
                      <Notifications color="disabled" />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      {
                        notifications.map(noti => (
                          <>
                            <div className={`p-2 w-[500px] ${noti.urgencia == 1 && 'bg-yellow-100'} ${noti.urgencia == 2 && 'bg-red-100'}`}>
                              <Typography fontSize={16}>{noti.content}</Typography>
                              <Typography variant="caption">{noti.dateStr}</Typography>
                            </div>
                            <Divider></Divider>
                          </>

                        ))
                      }

                      {notifications.length == 0 && <div className={`p-2`}>
                        <Typography fontSize={16}>No hay notificaciones aún</Typography>
                      </div>
                      }
                    </Menu>
                  </div>
                  <div onClick={() => logoutHandler()} className="flex gap-2  justify-center items-center h-8 p-1 px-4 
                  text-blue-50 bg-blue-500 rounded-[100px] hover:bg-blue-700 
                  hover:text-white cursor-pointer">
                    <Typography className="text-xs">{username}</Typography>
                    <ExitToApp fontSize="small" />
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
