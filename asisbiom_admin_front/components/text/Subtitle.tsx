import { Typography } from "@mui/material";
import { Open_Sans } from "next/font/google";

const open_sans = Open_Sans({ subsets: ["latin"], weight: "variable" });

type Props = { children: string };

export function Subtitle({ children }: Props) {
  return (
    <Typography
      className={`${open_sans.className} text-blue-600`}
      fontWeight={500}
      variant="subtitle1"
    >
      {children}
    </Typography>
  );
}
