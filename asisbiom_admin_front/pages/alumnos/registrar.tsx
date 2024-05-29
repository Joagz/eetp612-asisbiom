import { Form, useForm } from "react-hook-form";
import axios from "axios";
import { MainLayout, Overline, Paragraph } from "@/components";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { MqttDataPacket, SensorActions, useMqtt } from "@/hooks";
/*
    nombreCompleto
    dni
    turno
    curso
    division
*/

interface AlumnosCursoData {
  alumnos: AlumnoData[];
  curso: {
    id: number;
    curso: number;
    turno: number;
    division: string;
  };
}
interface AlumnoData {
  nombreCompleto: string;
  dni: string;
}
interface Curso {
  curso: number;
  turno: number;
  division: string;
}
interface SensorData {
  id: number;
  ip: string;
  sensorId: string;
  ubicacion: string;
}

const registrar = () => {
  const [sensores, setSensores] = useState<SensorData[]>([]);
  const [listado, setListado] = useState<AlumnosCursoData[]>([]);
  const mqttClient = useMqtt();

  useMemo(() => {
    axios
      .get<SensorData[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/sensor`)
      .then((response) => setSensores(response.data));

    axios
      .get<AlumnosCursoData[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/list-cursos`
      )
      .then((response) => {
        setListado(response.data);
      });
  }, []);

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm();

  function onSubmit(data: any) {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/registrar`, {
        nombreCompleto: data.nombreCompleto,
        dni: data.dni,
        curso: data.curso,
      })
      .then((response) => {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/sensor/${data.sensor}`)
          .then((res) => {
            const dataPacket: MqttDataPacket = {
              accion: SensorActions.REGISTER,
              idAlumno: response.data.id,
              sensorId: res.data.sensorId,
            };

            console.log(dataPacket);
            axios
              .post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/sensor/send-message`,
                dataPacket
              )
              .then((res) => {
                console.log(res.data);
              });
          });
      });
  }

  return (
    <MainLayout title={"Registrar alumno"}>
      <section className="flex flex-wrap w-full gap-4">
        <article className="flex flex-col gap-5 flex-1 min-w-[500px]">
          <div className="h-5"></div>
          <Form
            control={control}
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 border rounded-md w-full flex flex-col gap-4"
          >
            <Overline>Nuevo alumno</Overline>
            <Paragraph>
              Luego de haber sido registrado, se le pedirá en el sensor
              seleccionado que coloque la huella (al alumno).
            </Paragraph>

            <FormControl fullWidth>
              <InputLabel id="sensor-select-label">Sensor</InputLabel>
              <Select
                {...register("sensor", { required: true })}
                label="Sensor"
                labelId="sensor-select-label"
                value={1}
              >
                {sensores.map((sensor) => (
                  <MenuItem value={sensor.id}>
                    <div className="flex flex-col gap-1">
                      <Typography variant="body2" color={"GrayText"}>
                        Dirección IP: {sensor.ip}
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        Nombre: {sensor.sensorId}
                      </Typography>
                      <Typography variant="body2">
                        Se encuentra en {sensor.ubicacion}
                      </Typography>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              placeholder="Nombre Completo"
              size="small"
              {...register("nombreCompleto", { required: true })}
              error={errors?.nombreCompleto != null}
              helperText={
                errors?.nombreCompleto != null && "Este campo es obligatorio"
              }
              id="nombreCompleto"
            ></TextField>

            <TextField
              placeholder="Nro. de Documento (DNI)"
              size="small"
              {...register("dni", { required: true })}
              error={errors?.dni != null}
              helperText={errors?.dni != null && "Este campo es obligatorio"}
              id="dni"
            ></TextField>

            <FormControl fullWidth>
              <InputLabel size="small" id="curso-select-label">
                Curso
              </InputLabel>
              <Select
                {...register("curso", { required: true })}
                size="small"
                label="Curso"
                labelId="curso-select-label"
                defaultValue={1}
              >
                <MenuItem disabled>Turno Mañana</MenuItem>
                {listado
                  .filter((obj) => obj.curso.turno == 1)
                  .map((obj) => {
                    return (
                      <MenuItem value={obj.curso.id}>
                        {obj.curso.curso} "{obj.curso.division}"
                      </MenuItem>
                    );
                  })}
                <MenuItem disabled>Turno Tarde</MenuItem>
                {listado
                  .filter((obj) => obj.curso.turno == 2)
                  .map((obj) => {
                    return (
                      <MenuItem value={obj.curso.id}>
                        {obj.curso.curso} "{obj.curso.division}"
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>

            <Button type="submit">Registrar</Button>
          </Form>
        </article>
        <article className="flex flex-col gap-5 flex-1 min-w-[500px]">
          <div className="h-5"></div>

          <Overline>Turno Mañana</Overline>
          {listado
            .filter((obj) => obj.curso.turno == 1)
            .map((obj) => (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {obj.curso.curso} '{obj.curso.division}'
                      </TableCell>
                      <TableCell>Nombre completo</TableCell>
                      <TableCell>DNI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {obj.alumnos.map((alumno) => (
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>{alumno.nombreCompleto}</TableCell>
                        <TableCell>{alumno.dni}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ))}
          <Overline>Turno Tarde</Overline>
          {listado
            .filter((obj) => obj.curso.turno == 2)
            .map((obj) => (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {obj.curso.curso} '{obj.curso.division}'
                      </TableCell>
                      <TableCell>Nombre completo</TableCell>
                      <TableCell>DNI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {obj.alumnos.map((alumno) => (
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>{alumno.nombreCompleto}</TableCell>
                        <TableCell>{alumno.dni}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ))}
        </article>
      </section>
    </MainLayout>
  );
};

export default registrar;
