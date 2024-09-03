import React, { useMemo, useState } from "react";
import { MainLayout, Paragraph, Title } from "@/components";
import { useApi } from "@/hooks";
import Alumno from "@/interface/Alumno";
import { Typography } from "@mui/material";

export function AlumnoById({ id }: { id: number }) {

    const [alumno, setAlumno] = useState<Alumno>();
    const [asistencias, setAsistencias] = useState<any>([]);

    useMemo(() => {
        useApi<Alumno>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/${id}` }).then((res: any) => setAlumno(res.data));
        useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/asistencias/${id}` }).then((res: any) => setAsistencias(res.data));
    }, [])

    return (
        <MainLayout title="">
            <div className="flex w-full h-full gap-4 pt-20 p-4">
                <div className="flex flex-col gap-4 flex-1 overflow-auto">
                    {
                        asistencias.map((asistencia: any) => (
                            <div className="w-full rounded-md border p-2">
                                <Typography variant="caption">{asistencia.dia} {asistencia.fecha}</Typography>
                                <Typography variant="subtitle1">{asistencia.clase}</Typography>
                                <Typography>Horario de entrada <code>{asistencia.horarioEntrada}</code></Typography>
                                <Typography>Horario de salida/retiro: <code>{asistencia.horarioRetiro}</code></Typography>
                                <Typography variant="caption" color={"red"}>{asistencia.retirado && "RETIRADO"}</Typography>
                                <Typography variant="caption">{asistencia.retirado && `: ${asistencia.razonRetiro}`}</Typography>
                                <Typography variant="caption" color={"red"}>{asistencia.tardanza && "TARDANZA"}</Typography>
                            </div>
                        ))
                    }
                </div>
                <div className="flex flex-1 flex-col gap-4 static">
                    <div className="fixed w-full flex gap-2 border rounded-md p-4 flex-col">
                        <Title>{alumno?.nombreCompleto}</Title>
                        <Paragraph><b>Correo Electrónico</b>: {alumno?.correoElectronico || "Nulo"}</Paragraph>
                        <Paragraph><b>DNI</b>: {alumno?.dni}</Paragraph>
                        <Paragraph><b>Teléfono</b>: {alumno?.telefono || "Nulo"}</Paragraph>
                        {alumno?.curso && <Paragraph><b>Curso</b>: {alumno?.curso.curso} {alumno?.curso.division}</Paragraph>}
                        {!alumno?.curso && <Paragraph>Curso no asignado</Paragraph>}
                        <Paragraph><b>ID</b>: {alumno?.id}</Paragraph>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}


AlumnoById.getInitialProps = async ({ query }: any) => {
    const { id } = query;
    return { id };
};

export default AlumnoById;