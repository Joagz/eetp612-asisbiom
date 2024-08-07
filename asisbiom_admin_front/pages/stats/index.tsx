import { MainLayoutFixedHeight, Overline, Paragraph, Title } from "@/components"
import { ArrowRight, FileDownload } from "@mui/icons-material"
import { Button, Card, Paper, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material"
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

const pdfName: string = "Extraccion_de_datos_y_estadisticas.pdf";


const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Alumno', width: 450 },
    { field: 'col2', headerName: 'Puntaje', width: 150 },
];

const Stats = () => {

    const [rows, setRows] = useState<GridRowsProp>();

    useMemo(() => {
        // conseguir datos
    }, []);


    return (
        <MainLayoutFixedHeight title="Estadísticas">
            <Title>Estadísticas</Title>
            <Paragraph>Las estadísticas de su institución se mostrarán aquí, para más información puede revisar la documentación oficial del proyecto</Paragraph>
            <Button target="_blank" href={`/api/pdf/${pdfName}`} color="inherit" variant="outlined" startIcon={<FileDownload />}>Extracción de datos y estadísticas</Button>

            <Card component={Paper} className="flex flex-col gap-2 p-4 w-full lg:w-1/2 sm:w-3/4">
                <div className="flex w-full justify-between">
                    <Overline>porcentaje de asistencias:</Overline>
                    <Overline>0%</Overline>
                </div>
                <div className="flex w-full justify-between">
                    <Overline>porcentaje de tardanzas:</Overline>
                    <Overline>0%</Overline>
                </div>
                <br />
                <Overline>Índice de puntualidad</Overline>
                {rows &&
                    <DataGrid pageSizeOptions={[20]} rows={rows} columns={columns}></DataGrid>
                }
            </Card>

        </MainLayoutFixedHeight>
    )
}

export default Stats