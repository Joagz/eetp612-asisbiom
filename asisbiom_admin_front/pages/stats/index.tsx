import { MainLayoutFixedHeight, Overline, Paragraph, Title } from "@/components"
import { useApi } from "@/hooks";
import Alumno from "@/interface/Alumno";
import { PictureAsPdf } from "@mui/icons-material"
import { Button, Card, Divider, Input, Paper, Slider, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
    const [distribucionNormal, setDistribucionNormal] = useState<{
        promedio: number,
        desviacionEstandar: number
    }>();
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
        useApi<number>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/asistencias/porcentaje` }).then(res => setPorcentajeAsistencias(res.data));
        useApi<number>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/puntualidad/porcentaje` }).then(res => setPorcentajePuntualidad(res.data));
        useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/distribucion-normal` }).then(res => setDistribucionNormal(res.data));
        useApi<number>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/gini` }).then(res => setIndiceGini(res.data));
        useApi<number[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/lorenz` }).then(res => {
            const curvaData = res.data;
            const numAlumnos = alumnos.length;

            setCurva(curvaData.map((data, index) => {

                return {
                    id: index,
                    Alumno: alumnos[index].nombreCompleto,
                    curva: data,
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
                <Divider />
                <div className="flex w-full justify-between">
                    <Overline>porcentaje de puntualidad:</Overline>
                    <Overline>{porcentajePuntualidad}%</Overline>
                </div>
                <Divider />
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
                <Divider />
                {
                    distribucionNormal &&
                    <>
                        <Overline>Distribución Normal</Overline>
                        <DistribucionNormal median={distribucionNormal.promedio} stddev={distribucionNormal.desviacionEstandar} />
                        <div className="flex w-full justify-between">
                            <Overline>valor promedio:</Overline>
                            <Overline>{distribucionNormal.promedio}</Overline>
                        </div>
                        <div className="flex w-full justify-between">
                            <Overline>desviación estándar:</Overline>
                            <Overline>{distribucionNormal.desviacionEstandar}</Overline>
                        </div>
                    </>
                }
                                <br />
                <Divider />
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
                <Divider />
                <Overline>Desigualdad de puntaje</Overline>
                <ResponsiveContainer width="100%" height="100%" aspect={1}>
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
                    </LineChart>
                </ResponsiveContainer>
                <div className="flex w-full justify-between">
                    <Overline>Indice de Gini:</Overline>
                    <Overline>{indiceGini}</Overline>
                </div>
                <Divider />
            </Card>


        </MainLayoutFixedHeight>
    )
}
export const DistribucionNormal: React.FC<{ median: number, stddev: number }> = ({ median, stddev }) => {

    const [lengthSlider, setLengthSlider] = useState(30);

    // Create a range of x values centered around the median
    const data = Array.from({ length: lengthSlider }, (_, index) => {
        const x = index - lengthSlider / 2 - Math.abs(median); // Center x values around 0
        return {
            x: x,
            y: Math.pow(Math.E, -Math.pow(x - median, 2) / (2 * Math.pow(stddev, 2))) / (stddev * Math.sqrt(2 * Math.PI)),
        };
    });

    return (<>
        <ResponsiveContainer aspect={1.5}>
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
                <Tooltip />
                <YAxis
                    tick={false}
                    dataKey="y"
                    domain={['auto', 'auto']}
                    type="number"
                    interval={0}
                    label={{
                        value: `% de llegada`,
                        style: { textAnchor: 'middle' },
                        angle: -90,
                        position: 'left',
                        offset: 0,
                    }}
                    allowDataOverflow={true}
                    strokeWidth={0}
                />

                <XAxis
                    dataKey="x"
                    domain={['auto', 'auto']}
                    interval={0}
                    type="number"
                    label={{
                        key: 'xAxisLabel',
                        value: 'Diferencia de llegada (minutos)',
                        position: 'bottom',
                    }}
                    allowDataOverflow={true}
                    strokeWidth={1}
                />
                <ReferenceLine x={0} stroke="gray" strokeWidth={1.5} strokeOpacity={0.65} />
                <Line strokeWidth={2} data={data} dot={false} type="monotone" dataKey="y" stroke="#1133ff" />
            </LineChart>
        </ResponsiveContainer>
        <Slider min={10} max={5000} defaultValue={1000} aria-label="Volume" value={lengthSlider} onChange={(e: any) => setLengthSlider(e.target.value)} />
    </>
    );
};


export default Stats