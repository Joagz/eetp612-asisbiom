import { Card, CardContainer, PrincipalLayout } from "@/components";

export default function Home() {
  return (
    <PrincipalLayout justify="start" title={"Inicio"}>
      <div className="text-center lg:text-2xl pb-3">
        <h1 className="font-black text-2xl lg:text-5xl">ASISBIOM</h1>
        <p>Sistema de Asistencia Biométrica</p>
      </div>
      <div className="flex flex-1 w-full">
        <CardContainer cols={1}>
          <Card
            href="/sensores"
            title={"Sensores"}
            info={"Ver sensores disponibles en la institución."}
          />
        </CardContainer>
      </div>
    </PrincipalLayout>
  );
}
