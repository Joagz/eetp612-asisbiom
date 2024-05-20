import { Typography } from "@mui/material";
import { Open_Sans } from "next/font/google";

const open_sans = Open_Sans({ subsets: ["latin"], weight: "variable" });

type Props = { children: string };

export function Title({ children }: Props) {
  return (
    <Typography
      className={`${open_sans.className} text-6xl`}
      fontWeight={600}
      variant="h1"
    >
      {children}
    </Typography>
  );
}
