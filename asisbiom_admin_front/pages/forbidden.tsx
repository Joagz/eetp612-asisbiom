import { MainLayout, Overline, Title } from "@/components";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

export function ForbiddenPage() {
  const router = useRouter();
  const { forbidden_url } = router.query;
  const { rollback } = router.query;

  if (rollback && forbidden_url)
    return (
      <MainLayout title="Acceso Prohido">
        <div className="gap-4 absolute h-full w-full flex flex-col justify-center items-center">
          <Title>Lo sentimos... no tienes acceso a "{forbidden_url}"</Title>
          <Overline>
            Si cree que esto es un error, por favor contáctese con la
            institución.
          </Overline>
          <Button href={rollback} variant="contained">
            OK
          </Button>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout title="Acceso Prohido">
      <div className="gap-4 absolute h-full w-full flex flex-col justify-center items-center">
        <Title>Lo sentimos... no tienes acceso esta dirección</Title>
        <Overline>
          Si cree que esto es un error, por favor contáctese con la institución.
        </Overline>
        <Button href={"/"} variant="contained">
          OK
        </Button>
      </div>
    </MainLayout>
  );
}
export default ForbiddenPage;
