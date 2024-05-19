import { Card, CardContainer, PrincipalLayout } from '@/components'
import React from 'react'

type Props = {}

const InicioSensores = (props: Props) => {
    return (
        <PrincipalLayout justify="start" title={"Inicio"}>
            <div className="text-center lg:text-2xl pb-3">
                <h1 className="font-black text-2xl lg:text-5xl">Sensores</h1>
                <p>Sensores conectados en la institución.</p>
            </div>
            <div className="flex flex-1 w-full">
                <CardContainer>
                    <Card href="/sensores/1" title={"Sensor #1"} info={"Sensor en la entrada de la escuela."} />
                </CardContainer>
            </div>
        </PrincipalLayout>
    )
}

export default InicioSensores