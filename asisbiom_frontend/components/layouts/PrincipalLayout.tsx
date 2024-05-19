import Head from 'next/head'
import React from 'react'

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

type Props = {
  title: string;
  children: JSX.Element | JSX.Element[]
  justify?: "center" | "start" | "end"
}

export const PrincipalLayout = ({ title, children, justify = "center" }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main className={`px-3 ${montserrat.className} h-screen overflow-x-hidden py-10 flex items-center justify-${justify} flex-col gap-3`}>
        <div className='bg-img-default top-0 left-0 fixed h-full w-full'></div>
        {children}
        <div>
          <h2 className="font-black lg:text-xl">EETP N.612 "Eudocio de los Santos Giménez"</h2>
          <p>Coronda, Santa fe</p>
        </div>

      </main>
    </>
  )
}