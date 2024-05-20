import { Open_Sans } from "next/font/google";
import { MainLayout } from "@/components";

const open_sans = Open_Sans({ subsets: ["latin"], weight: "variable" });

export default function Home() {
  return <MainLayout title="Inicio"></MainLayout>;
}
