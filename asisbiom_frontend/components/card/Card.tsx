import Image from 'next/image'
import React from 'react'

type Props = {
    title: string,
    info: string,
    icon?: string,
    href: string
}

export const Card = ({ href, icon = "/icons/sensor.svg", info, title }: Props) => {
    return (
        <a href={href} className="h-full text-white hover:scale-95 transition-all lg:flex-grow card snap-center flex flex-col border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg justify-center items-center gap-2">
            <Image src={icon} alt="sensor" className="w-full h-20" width={0} height={0} />
            <div>
                <h4 className="font-bold text-xl">{title}</h4>
                <p className="text-md">{info}</p>
            </div>
            <p className="text-sm text-blue-300">Ver más</p>
        </a>
    )
}