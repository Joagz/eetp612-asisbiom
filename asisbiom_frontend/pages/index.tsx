import { PrincipalLayout } from "@/components";

export default function Home() {
  return (
    <PrincipalLayout justify="start" title={"Inicio"}>
      <div className="text-center lg:text-2xl pb-3">
        <h1 className="font-black text-2xl lg:text-5xl">ASISBIOM</h1>
        <p>Sistema de Asistencia Biométrica</p>
      </div>
      <div className="flex flex-1 h-full w-full list-decoration">
        <ul className="list-disc pl-4 h-full w-full flex flex-col gap-6 justify-center font-semibold">
          <a href="/sensores" className="list-item p-1 w-full">Lista de Sensores</a>
          <a href="/autenticar" className="list-item p-1 w-full">Autorizar dispositivo</a>
          <a href="/alumnos" className="list-item p-1 w-full">Alumnos registrados</a>
        </ul>
      </div>
    </PrincipalLayout>
  );
}
