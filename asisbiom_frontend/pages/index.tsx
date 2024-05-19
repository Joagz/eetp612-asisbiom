import { Card, CardContainer, PrincipalLayout } from "@/components";


export default function Home() {
  return (
    <PrincipalLayout justify="start" title={"Inicio"}>
      <div className="text-center lg:text-2xl pb-3">
        <h1 className="font-black text-2xl lg:text-5xl">ASISBIOM</h1>
        <p>Sistema de Asistencia Biométrica</p>
      </div>
      <div className="flex flex-1 w-full">
        <CardContainer>
        <Card href="/sensores" title={"Sensores"} info={"Ver sensores disponibles en la institución."} />
        <Card href="/alumnos" title={"Alumnos"} info={"Listado de alumnos por curso, división y turno."} />
        </CardContainer>
      </div>
    </PrincipalLayout>
  );
}

