import { MainLayoutFixedHeight, Title } from '@/components'
import { useApi } from '@/hooks';
import { Visibility } from '@mui/icons-material';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import React, { useMemo, useState } from 'react'

const reportes = () => {
    const [reports, setReports] = useState<any>([]);

    useMemo(() => {
        useApi({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/reportes` }).then(res => {
            setReports(res.data)
        })
    }, [])

    return (
        <MainLayoutFixedHeight title='Reportes'>
                <Title>Reportes y Ayuda</Title>
            <div className='w-full md:w-3/4 px-2'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre Completo</TableCell>
                            <TableCell>Título</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((reporte: any) =>
                            <TableRow>
                                <TableCell>{reporte.nombreCompleto}</TableCell>
                                <TableCell>{reporte.titulo}</TableCell>
                                <TableCell>{reporte.fecha}</TableCell>
                                <TableCell><IconButton href={`/alumnos/reportes/${reporte.id}`}><Visibility /></IconButton></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </MainLayoutFixedHeight>
    )
}

export default reportes