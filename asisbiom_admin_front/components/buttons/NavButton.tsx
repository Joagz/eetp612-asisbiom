import { Button } from "@mui/material";

type Props = { children: any; href: string, icon?: any };

export const NavButton = ({ children, href, icon }: Props) => {
  return (
    <Button
    size="small"
      href={href}
      color="inherit"
      startIcon={icon}
      className="flex justify-start px-3 py-2 text-gray-500 hover:text-black"
    >
      {children}
    </Button>
  );
};
