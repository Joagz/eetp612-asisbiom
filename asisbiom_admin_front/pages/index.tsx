import { Open_Sans } from "next/font/google";
import { MainLayout, Overline, Title } from "@/components";

const open_sans = Open_Sans({ subsets: ["latin"], weight: "variable" });

export default function Home() {
  return (
    <MainLayout title="Inicio">
      <article className="flex flex-col">
        <div className="h-20"></div>
        <Overline>EETP N°612 "Eudocio de los Santos Giménez"</Overline>
        <Title>Sistema de Asistencias Biométrico</Title>
      </article>
    </MainLayout>
  );
}
