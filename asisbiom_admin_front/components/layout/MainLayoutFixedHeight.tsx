import Head from "next/head";
import { NavBar } from "../nav";
import { useState } from "react";

type Props = {
  title: string;
  children?: any;
};

export const MainLayoutFixedHeight = ({ title, children }: Props) => {
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
        } flex justify-start items-start w-full lg:flex-row flex-col`}
      >
        <article className="py-10 flex flex-col w-full items-center gap-8">
          <div className="h-20"></div>

          {children}
        </article>
      </main>
    </>
  );
};
