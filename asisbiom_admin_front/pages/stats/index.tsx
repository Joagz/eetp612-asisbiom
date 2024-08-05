import { MainLayoutFixedHeight, Paragraph, Title } from "@/components"
import { ArrowRight, FileDownload } from "@mui/icons-material"
import { Button } from "@mui/material"

const pdfName: string = "Extraccion_de_datos_y_estadisticas.pdf";

const Stats = () => {
    return (
        <MainLayoutFixedHeight title="Estadísticas">
            <Title>Estadísticas</Title>
            <Paragraph>Las estadísticas de su institución se mostrarán aquí, para más información puede revisar la documentación oficial del proyecto</Paragraph>
            <Button target="_blank" href={`/api/pdf/${pdfName}`} color="inherit" variant="outlined" startIcon={<FileDownload />}>Extracción de datos y estadísticas</Button>
            <Paragraph>Si quiere activar las estadísticas dirígase a <b>Configuración</b><ArrowRight /><b>Escuela</b><ArrowRight /><b>Activar estadísticas</b></Paragraph>
        </MainLayoutFixedHeight>
    )
}

export default Stats