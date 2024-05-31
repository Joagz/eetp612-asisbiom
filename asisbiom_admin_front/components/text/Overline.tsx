import { Typography } from "@mui/material";
import { Open_Sans } from "next/font/google";

const open_sans = Open_Sans({ subsets: ["latin"], weight: "variable" });

type Props = { children: any };

export function Overline({ children }: Props) {
  return (
    <Typography
      className={`${open_sans.className} text-lg`}
      fontWeight={400}
      variant="overline"
    >
      {children}
    </Typography>
  );
}
