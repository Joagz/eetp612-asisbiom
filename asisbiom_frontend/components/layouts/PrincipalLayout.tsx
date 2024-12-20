import Head from 'next/head'
import React from 'react'

import { IBM_Plex_Mono } from "next/font/google";
const font = IBM_Plex_Mono({weight: '400', subsets:['latin']});

type Props = {
  title: string;
  children: JSX.Element | JSX.Element[]
  justify?: "center" | "start" | "end"
  disableFooter?: boolean;
}

export const PrincipalLayout = ({ disableFooter = false, title, children, justify = "center" }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main className={`overflow-hidden h-screen px-3 ${font.className} overflow-x-hidden py-5 flex items-center justify-${justify} flex-col gap-3`}>
        <div className='bg-img-default top-0 left-0 fixed h-full w-full'></div>
        {children}
        {
          !disableFooter &&         <div>
          <p className="font-black text-[12px]">EETP N.612 "Eudocio de los Santos Giménez"</p>
          <p>Coronda, Santa fe</p>
        </div>
        }
      </main>
    </>
  )
}