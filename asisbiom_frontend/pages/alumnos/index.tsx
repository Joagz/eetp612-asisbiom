import { PrincipalLayout, CardContainer, Card } from '@/components'
import React from 'react'

type Props = {}

const index = (props: Props) => {
  return (
    <PrincipalLayout justify="start" title={"Inicio"}>
      <div className="text-center lg:text-2xl pb-3">
        <h1 className="font-black text-2xl lg:text-5xl">Alumnos</h1>
        <p>Listado de alumnos en la institución.</p>
      </div>
      <div className="flex flex-1 w-full">
        <CardContainer>
          <Card href="/alumnos/manana/" title={"Turno Mañana"} info={"Alumnos del turno mañana."} />
          <Card href="/alumnos/tarde/" title={"Turno Tarde"} info={"Alumnos del turno tarde."} />
          <Card href="/alumnos/resumen/" title={"Resumen diario"} info={"Consultar las estadísticas del día de hoy."} />
        </CardContainer>
      </div>
    </PrincipalLayout>)
}

export default index