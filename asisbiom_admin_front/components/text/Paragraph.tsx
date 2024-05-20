import { Typography } from "@mui/material";
import { Open_Sans } from "next/font/google";

const open_sans = Open_Sans({ subsets: ["latin"], weight: "variable" });

type Props = { children: any };

export function Paragraph({ children }: Props) {
  return (
    <Typography variant="body1" className="text-xs" align="justify">
      {children}
    </Typography>
  );
}
