import { MainLayoutFixedHeight, Overline, Paragraph, Title } from "@/components"
import { useApi } from "@/hooks";
import Alumno from "@/interface/Alumno";
import { FileDownload, PictureAsPdf } from "@mui/icons-material"
import { Button, Card, Divider, Paper, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const pdfName: string = "Extraccion_de_datos_y_estadisticas.pdf";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', hideable: true },
    { field: 'Alumno', headerName: 'Alumno', width: 300 },
    { field: 'Puntaje', headerName: 'Puntaje' },
];
interface dataType { name: string, puntaje: number };
const Stats = () => {

    const [data, setData] = useState<dataType[]>();
    const [sortedData, setSortedData] = useState<any>();
    const [curva, setCurva] = useState<any>();
    const [rows, setRows] = useState<GridRowsProp>();
    const [porcentajeAsistencias, setPorcentajeAsistencias] = useState<number>(0);
    const [porcentajePuntualidad, setPorcentajePuntualidad] = useState<number>(0);
    const [indiceGini, setIndiceGini] = useState<number>(0);

    useMemo(() => {
        let alumnos: Alumno[] = [];
        useApi<Alumno[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno` }).then(res => { alumnos = res.data });
        useApi<number[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/puntaje?positive-only=1` }).then(
            res => {
                console.log(res.data)
                setData(res.data.map((data, index) => { return { name: alumnos[index].nombreCompleto, puntaje: data } }));
                setSortedData(res.data.sort((a, b) => a - b).map((data, index) => { return { name: alumnos[index].nombreCompleto, puntaje: data } }));
                setRows(res.data.map((data, index) => { return { id: index, Alumno: alumnos[index].nombreCompleto, Puntaje: data } }))
            })
        useApi<number>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/asistencias/promedio` }).then(res => setPorcentajeAsistencias(res.data));
        useApi<number>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/puntualidad/promedio` }).then(res => setPorcentajePuntualidad(res.data));
        useApi<number>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/gini` }).then(res => setIndiceGini(res.data));
        useApi<number[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/lorenz` }).then(res => {
            const curvaData = res.data;
            const numAlumnos = alumnos.length;
        
            setCurva(curvaData.map((data, index) => {
                // Compute igualdad as a normalized index value from 0 to 1
                const igualdad = (numAlumnos > 1) ? index / (numAlumnos - 1) : 0;
        
                return { 
                    id: index, 
                    Alumno: alumnos[index].nombreCompleto, 
                    curva: data, 
                    igualdad: igualdad 
                };
            }));
        });
        
        
    }, []);


    return (
        <MainLayoutFixedHeight title="Estadísticas">
            <Title>Estadísticas</Title>
            <Paragraph>Las estadísticas de su institución se mostrarán aquí, para más información puede revisar la documentación oficial del proyecto</Paragraph>
            <Button target="_blank" href={`/api/pdf/${pdfName}`} color="inherit" variant="outlined" startIcon={<PictureAsPdf />}>Extracción de datos y estadísticas</Button>

            <Card component={Paper} className="flex flex-col gap-2 p-4 w-full lg:w-1/2 sm:w-3/4">
                <div className="flex w-full justify-between">
                    <Overline>porcentaje de asistencias:</Overline>
                    <Overline>{porcentajeAsistencias}%</Overline>
                </div>
                <Divider/>                
                <div className="flex w-full justify-between">
                    <Overline>porcentaje de puntualidad:</Overline>
                    <Overline>{porcentajePuntualidad}%</Overline>
                </div>
                <Divider/>                
                <Overline>Índice de puntualidad</Overline>
                <Typography variant="caption">Ordenados de menor a mayor</Typography>
                {rows &&
                    <DataGrid initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                        rows={rows} columns={columns}></DataGrid>
                }
                <br />
                <Divider/>                
                <Overline>Gráfica del índice de puntualidad</Overline>
                <ResponsiveContainer width="100%" height="100%" aspect={1.5}>
                    <LineChart
                        width={500}
                        height={500}
                        data={data}
                        margin={{
                            top: 30,
                            right: 30,
                            left: 30,
                            bottom: 30,
                        }}
                    >
                        <XAxis tick={false} dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="basis" dataKey="puntaje" dot={false} stroke="#1133ff" />
                    </LineChart>

                </ResponsiveContainer>
                <br />
                <Divider/>                
                <Overline>Gráfica ordenada</Overline>
                <ResponsiveContainer width="100%" height="100%" aspect={1.5}>

                    <LineChart
                        width={500}
                        height={500}
                        data={sortedData}
                        margin={{
                            top: 30,
                            right: 30,
                            left: 30,
                            bottom: 30,
                        }}
                    >
                        <XAxis tick={false} dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="basis" dataKey="puntaje" dot={false} stroke="#1133ff" />
                    </LineChart>
                </ResponsiveContainer>
                <Divider/>                
                <Overline>Desigualdad de puntaje</Overline>
                <ResponsiveContainer width="100%" height="100%" aspect={1.5}>
                    <LineChart
                        width={500}
                        height={500}
                        data={curva}
                        margin={{
                            top: 30,
                            right: 30,
                            left: 30,
                            bottom: 30,
                        }}
                    >
                        <XAxis tick={false} dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="basis" dataKey="curva" dot={false} stroke="#1133ff" />
                        <Line type="monotone" dataKey="igualdad" dot={false} stroke="#ee9221" />
                    </LineChart>
                </ResponsiveContainer>
                <div className="flex w-full justify-between">
                    <Overline>Indice de Gini:</Overline>
                    <Overline>{indiceGini}</Overline>
                </div>
                <Divider/>                
            </Card>


        </MainLayoutFixedHeight>
    )
}

export default Stats