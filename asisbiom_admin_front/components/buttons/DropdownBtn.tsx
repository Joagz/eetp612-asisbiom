import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

type Props = {
  title: string;
  children: JSX.Element[] | JSX.Element;
  href?: string;
  icon?: any
};

export function DropdownBtn({ children, title, href, icon}: Props) {
  const [menuButton, setMenuButton] = useState(false);

  return (
    <>
      <Button
        size="small"
        color="inherit"
        className="flex py-2 justify-start px-3 text-gray-500 w-full"
        startIcon={icon}
        onClick={() => setMenuButton(!menuButton)}
        endIcon={!menuButton ? <ArrowDropDown /> : <ArrowDropUp />}
      >
        {href ? (
          <a href={href} className="hover:text-black">
            {title}
          </a>
        ) : (
          <>{title}</>
        )}
      </Button>
      {menuButton && <div className="pl-4">{children}</div>}
    </>
  );
}
