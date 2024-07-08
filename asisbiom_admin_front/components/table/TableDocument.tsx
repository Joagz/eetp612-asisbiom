import { PictureAsPdf } from "@mui/icons-material";
import { TableRow, TableCell } from "@mui/material";
import Link from "next/link";
import React from "react";
import { Paragraph } from "../text";

type Props = {
  name: string;
  info: string;
  link: string;
};

export const TableDocument = (props: Props) => {
  return (
    <TableRow>
      <TableCell>
        <Link
          href={props.link}
          target="_blank"
          className="flex gap-1 items-center text-blue-600"
        >
          <PictureAsPdf fontSize="small" />
          <Paragraph>{props.name}</Paragraph>
        </Link>
      </TableCell>
      <TableCell>
        <Paragraph>{props.info}</Paragraph>
      </TableCell>
    </TableRow>
  );
};
