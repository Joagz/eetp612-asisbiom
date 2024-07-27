import { PrincipalLayout } from "@/components";
import { useApi } from "@/hooks/useApi";
import Alumno from "@/interface/Alumno";
import { useMemo, useState } from "react";

export function Alumnos() {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);

    useMemo(() => {
        useApi<Alumno[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno` })
            .then(res => setAlumnos(res.data));
    }, [])

    return (
        <PrincipalLayout title="Alumnos">
            <div className="w-full flex-col h-screen flex justify-start items-start overflow-auto">
                <a className="text-sm font-bold pb-2" href="/">{'<<'} Volver</a>
                <table className="w-full text-left">
                    <thead>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Curso</th>
                    </thead>
                    <tbody>
                        {alumnos.map(alumno => (
                            <tr>
                                <td>{alumno.nombreCompleto}</td>
                                <td>{alumno.dni}</td>
                                <td>{alumno.curso.curso} "{alumno.curso.division}"</td>
                            </tr>
                        ))}
                    </tbody>
                </table></div>
        </PrincipalLayout>
    )
}

export default Alumnos;