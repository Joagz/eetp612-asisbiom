import React from 'react'
import { Button, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation"
import { MainLayoutFixedHeight, Overline } from "../../components"
import { useRouter } from 'next/router';

export function message() {
  const params = useSearchParams();
  const router = useRouter();

  return (
    <MainLayoutFixedHeight title="Notas">
      <div className='absolute top-0 bottom-0 w-1/2 flex flex-col items-center justify-center gap-4'>
        {params.get("success") && params.get("success") == "true" ?
          <Overline>Nota enviada a {params.get("alumno")}</Overline> :
          <Overline>Error al enviar la nota, lo sentimos...</Overline>}
        <Button fullWidth size='large' color='success' onClick={() => router.replace("/nota/listado")}>OK</Button>
      </div>
    </MainLayoutFixedHeight>
  )
}

export default message;
