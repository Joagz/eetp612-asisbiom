import Head from "next/head";
import { NavBar } from "../nav";
import { useState } from "react";

type Props = {
  title: string;
  children?: any;
};

export const MainLayout = ({ title, children }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen}></NavBar>
      <main
        className={`${
          menuOpen && "lg:pl-[17.5em]"
        } flex justify-start items-start p-4 w-full lg:flex-row flex-col`}
      >
        {children}
      </main>
    </>
  );
};
