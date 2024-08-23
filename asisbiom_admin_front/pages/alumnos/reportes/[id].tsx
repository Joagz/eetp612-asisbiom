import { MainLayoutFixedHeight, Overline, Paragraph, Title } from "@/components";
import { useApi } from "@/hooks";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";

export function AlumnoById({ id }: { id: number }) {

    const [reporte, setReporte] = useState<any>();
    const router = useRouter();

    useMemo(() => {
        useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/reportes/${id}` }).then((res: any) => { setReporte(res.data) });
    }, [])

    return (
        <MainLayoutFixedHeight title="Reporte recibido">
            {reporte ?
                <div className="flex flex-col gap-4 w-full md:w-3/4">
                    <Title>{reporte.titulo}</Title>
                    <Paragraph>{reporte.situacion}</Paragraph>
                    <br />
                    <Overline>Información de contacto</Overline>
                    {
                        reporte.email && <Typography fontWeight={300} variant="body2">Email: <code>{reporte.email}</code></Typography>
                    }
                    {
                        reporte.telefono && <Typography fontWeight={300} variant="body2">Teléfono: <code>{reporte.telefono}</code></Typography>
                    }
                    <Typography variant="body2" fontWeight={300}>Enviado por: {reporte.nombreCompleto}</Typography>
                    <Typography variant="body2" fontWeight={300}>Recibido el: {reporte.fecha}</Typography>
                    <Button onClick={() => router.back()}>Volver</Button>
                </div>
                : <div className="flex flex-col gap-4">
                    <Title>No se ha encontrado ningún reporte con este ID</Title>
                    <Button onClick={() => router.back()}>Volver</Button>
                </div>}
        </MainLayoutFixedHeight>
    );
}


AlumnoById.getInitialProps = async ({ query }: any) => {
    const { id } = query;
    return { id };
};

export default AlumnoById;