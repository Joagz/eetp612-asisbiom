import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Caption,
  MainLayout,
  Overline,
  Paragraph,
  SideMenu,
  Subtitle,
  TableDocument,
  Title,
} from "@/components";

export default function Info() {
  return (
    <MainLayout title="Acerca de">
      <article className="flex-[2] p-4 flex flex-col gap-3">
        <div className="h-20"></div>
        <Overline>E.E.T.P N°612 "Eudocio de los Santos Giménez"</Overline>
        <Caption>Coronda, Santa Fe, Argentina.</Caption>

        <Title>ASISBIOM</Title>
        <Subtitle>Sistema de Asistencia Biométrica</Subtitle>
        <Overline>Introducción</Overline>
        <Paragraph>
          El presente proyecto es desarrollado en una institución educativa con
          un número muy elevado de alumnos y que cuenta solo con un preceptor
          por turno. A raíz de esto, surgió la problemática de la ineficiencia y
          sobrecarga que se generaba hacia los preceptores y el equipo
          directivo. Se propuso una solución basada en una toma de asistencia de
          forma automática mediante datos biométricos, específicamente una
          huella dactilar.
        </Paragraph>
        <Overline>Objetivos</Overline>
        <Paragraph>
          El objetivo del proyecto es automatizar las recurrentes y largas
          tareas del área de preceptoría y secretaría, mejorando así la
          organización y el rendimiento escolar. El proyecto consta de varias
          partes coordinadas para realizar diversas tareas como la toma de
          asistencia, el registro de horarios de salida y entrada de los alumnos
          (ya sea por retiro o en el horario habitual), la creación de un
          recuento de faltas, y la realización de estadísticas con series de
          tiempo (por ejemplo, basadas en los horarios de entrada, para analizar
          la puntualidad de los alumnos, tanto de manera general como
          individual).
        </Paragraph>
        <Paragraph>
          También incluye la creación de un conteo de alumnos presentes,
          proporcionando al equipo directivo información sobre la asistencia.
          Esto agiliza la organización y el papeleo al eliminar el tiempo
          dedicado a la toma de asistencias, permitiendo que los profesores
          verifiquen si todos los alumnos que asistieron a la escuela están
          presentes en el aula a través de una aplicación alojada en una
          intranet en la propia escuela, entre otras tareas administrativas.
        </Paragraph>
        <Paragraph>
          El impacto ambiental del proyecto es notable debido a la reducción de
          la cantidad de materiales como papel y tinta que son utilizados
          diariamente para llevar a cabo las tareas mencionadas. Esto no solo
          implica una reducción del costo ambiental, sino que también mejorará
          la economía de la escuela en términos de tiempo y recursos.
        </Paragraph>
        <Paragraph>
          Aumenta la precisión de los registros, ya que almacena datos como la
          hora exacta. Además, no es posible la suplantación de identidad.
        </Paragraph>
        <Paragraph>
          En resumen, buscamos proveer una solución al tiempo y dinero
          invertidos en una tarea trivial como llevar el registro de alumnos,
          además de mejorar la comunicación del equipo directivo con el
          alumnado, teniendo en cuenta todas las variables posibles.
        </Paragraph>
        <TableContainer>
          <Table className="w-full" size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Paragraph>Documento</Paragraph>
                </TableCell>
                <TableCell>
                  <Paragraph>Info.</Paragraph>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableDocument
                name={"ASISBIOM v1.0"}
                info={"Documentación principal del proyecto"}
                link={"https://www.google.com"}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </article>
      <aside className="flex-1 w-full p-4 flex flex-col gap-4">
        <div className="h-20"></div>
        <div className="flex-1 flex flex-col gap-1">
          <Overline>Notas</Overline>
          <Paragraph>
            A la hora de crear el proyecto se iba a usar Espressif IDF, un
            framework dedicado al ESP32 (microcontrolador usado en el
            dispositivo). Se decidió no hacer por problemas de compatibilidad
            con el sensor. La decisión final fue de usar Arduino, y las
            librerías correspondientes.
          </Paragraph>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Overline>Alumnos responsables</Overline>
          <Paragraph>
            El proyecto fue realizado por los estudiantes Joaquín Gómez,
            Constanzo Tironi y Máximo Tironi, quienes están en cuarto año de la
            división 'A'. Nosotros, los que lo desarrollamos, queremos expresar
            nuestro agradecimiento a los profesores Sebastián Leandro Pisatti y
            Horacio Gabriel Ceferino Graells. Ellos no solo nos proporcionaron
            el espacio para llevar a cabo el proyecto, sino que también nos
            guiaron y apoyaron durante todo el proceso de desarrollo.
          </Paragraph>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Overline>Bibliografía</Overline>
          <Typography variant="body1" className="text-xs">
            <Link href="https://github.com/Joagz/eetp612-asisbiom">
              Repositorio de la aplicación
            </Link>
          </Typography>
          <Typography variant="body1" className="text-xs">
            <Link href="https://github.com/Joagz/esp32-mqtt-fingerprint">
              Código del microcontrolador
            </Link>
          </Typography>
          <Typography variant="body1" className="text-xs">
            <Link href="https://www.arduino.cc/">Arduino</Link>
          </Typography>
          <Typography variant="body1" className="text-xs">
            <Link href="https://nextjs.org/">NextJS</Link>
          </Typography>
          <Typography variant="body1" className="text-xs">
            <Link href="https://spring.io/">Spring Framework</Link>
          </Typography>
        </div>
      </aside>
    </MainLayout>
  );
}
