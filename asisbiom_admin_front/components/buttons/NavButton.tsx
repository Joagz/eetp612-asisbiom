import { Button } from "@mui/material";

type Props = { children: string; href: string };

export const NavButton = ({ children, href }: Props) => {
  return (
    <Button
    size="small"
      href={href}
      color="inherit"
      className="flex justify-start px-3 text-gray-500 hover:text-black"
    >
      {children}
    </Button>
  );
};
