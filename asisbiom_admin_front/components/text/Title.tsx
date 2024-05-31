import { Typography } from "@mui/material";
import { Open_Sans } from "next/font/google";

const open_sans = Open_Sans({ subsets: ["latin"], weight: "variable" });

type Props = { children: string, className?: string};

export function Title({ children, className }: Props) {
  return (
    <Typography
      className={`${open_sans.className} text-6xl ${className}`}
      fontWeight={600}
      variant="h1"
    >
      {children}
    </Typography>
  );
}
