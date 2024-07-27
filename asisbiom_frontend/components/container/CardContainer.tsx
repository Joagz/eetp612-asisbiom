import React from "react";
import { Card } from "../card";

type Props = {
  children: JSX.Element[] | JSX.Element;
  cols?: number;
};

export const CardContainer = ({ children, cols = 3 }: Props) => {
  return (
    <div className="justify-center h-full w-full items-center lg:flex-wrap flex lg:px-[10%]">
      <div className="w-full h-fit flex justify-center items-center">
        <div
          className={`h-52 snap-x snap-mandatory lg:grid lg:grid-cols-${cols} flex gap-3 items-center aspect-square overflow-x-scroll overflow-y-hidden lg:overflow-y-hidden lg:overflow-x-hidden`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
