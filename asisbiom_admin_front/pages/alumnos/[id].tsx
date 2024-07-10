import React, { useMemo, useState } from "react";
import { MainLayoutFixedHeight, Paragraph, Title } from "../../components";
import Alumno from "../../interface/Alumno";
import { useApi } from "../../hooks";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

export function AlumnoById({ id }: { id: number }) {

    const [alumno, setAlumno] = useState<Alumno>();
    const router = useRouter();
    
    useMemo(() => {
        useApi<Alumno>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/${id}` }).then(res => setAlumno(res.data));
    }, [])

    return (
        <MainLayoutFixedHeight title="">
            <Title>{alumno?.nombreCompleto}</Title>
            <div className="flex flex-col gap-4">
                <Paragraph>Correo Electrónico: {alumno?.correoElectronico || "Nulo"}</Paragraph>
                <Paragraph>DNI: {alumno?.dni}</Paragraph>
                <Paragraph>Teléfono: {alumno?.telefono || "Nulo"}</Paragraph>
                {alumno?.curso && <Paragraph>Curso: {alumno?.curso.curso} {alumno?.curso.division}</Paragraph>}
                {!alumno?.curso && <Paragraph>Curso no asignado</Paragraph>}
                <Paragraph>ID: {alumno?.id}</Paragraph>
                <Button variant="outlined" color="inherit" onClick={() => {router.back()}}>Atrás</Button>
            </div>
        </MainLayoutFixedHeight>
    );
}


AlumnoById.getInitialProps = async ({ query }: any) => {
    const { id } = query;
    return { id };
};

export default AlumnoById;