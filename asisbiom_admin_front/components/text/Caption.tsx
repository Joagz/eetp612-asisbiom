import { Typography } from "@mui/material";
import { Open_Sans } from "next/font/google";

const open_sans = Open_Sans({ subsets: ["latin"], weight: "variable" });

type Props = { children: string };

export function Caption({ children }: Props) {
  return (
    <Typography
      className={`${open_sans.className} text-sm text-gray-600`}
      variant="caption"
    >
      {children}
    </Typography>
  );
}
