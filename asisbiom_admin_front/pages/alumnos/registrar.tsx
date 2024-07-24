import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";
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
import { MqttDataPacket, SensorActions } from "@/hooks";
import { useRouter } from "next/router";
import { useApi } from "@/hooks/useApi";

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

interface SensorData {
  id: number;
  ip: string;
  ubicacion: string;
}

// Registrar un nuevo alumno
const registrar = () => {
  const router = useRouter();
  const [sensores, setSensores] = useState<SensorData[]>([]);
  const [listado, setListado] = useState<AlumnosCursoData[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [dniErr, setDniErr] = useState<boolean>(false);
  const [dniErrMsg, setDniErrMsg] = useState<string>("");

  useMemo(() => {
    useApi<SensorData[]>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/sensor`,
    }).then((response) => setSensores(response.data));

    useApi<AlumnosCursoData[]>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/list-cursos`,
    }).then((response) => {
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
    if (disabled) return;
    setDisabled(true);

    if (data.dni.length != 8) {
      setDniErr(true);
      setDniErrMsg("El DNI debe tener 8 caracteres");
      return;
    }

    // Realizamos verificaciones sobre el DNI
    useApi({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/documento/${data.dni}`,
    })
      .then((res) => {
        // Mostramos un error si el DNI está repetido
        if (res.status == 200) {
          setDniErr(true);
          setDniErrMsg("El DNI está registrado para otro alumno");
        }
      })
      .catch((err) => {
        useApi({
          url: `${process.env.NEXT_PUBLIC_API_URL}/api/sensor/${data.sensor}`,
        })
          .then((sensorApiRes: any) => {
            useApi({
              url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/registrar`,
              body: {
                nombreCompleto: data.nombreCompleto,
                dni: data.dni,
                curso: data.curso,
                correoElectronico: data.correoElectronico,
                telefono: data.telefono,
              },
              method: "POST",
            }).then((alumnoApiRes: any) => {
              router.reload();
            });
          })
          .catch((err) => {
            alert("Error sending message : \n" + err);
          });
      });
  }

  return (
    <MainLayout title={"Registrar alumno"}>
      <section className="flex flex-wrap w-full gap-4 p-6">
        <article className="flex flex-col gap-4 flex-1 min-w-[500px]">
          <div className="h-10"></div>
          <Form
            onChange={() => setDisabled(false)}
            control={control}
            onSubmit={
              handleSubmit(
                onSubmit
              ) as unknown as FormSubmitHandler<FieldValues>
            }
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
                defaultValue={1}
              >
                {sensores.map((sensor) => (
                  <MenuItem value={sensor.id}>
                    <div className="flex flex-col gap-1">
                      <Typography variant="body2" color={"GrayText"}>
                        Dirección IP: {sensor.ip}
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        Id: {sensor.id}
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
              helperText={
                (errors?.dni != null || dniErr) && (
                  <>{dniErr ? dniErrMsg : "Este campo es obligatorio"}</>
                )
              }
              id="dni"
            ></TextField>

            <TextField
              placeholder="Correo Electrónico (opcional)"
              size="small"
              {...register("correoElectronico", { required: false })}
              error={errors?.correoElectronico != null}
              id="correoElectronico"
            ></TextField>

            <TextField
              placeholder="Teléfono (opcional)"
              size="small"
              {...register("telefono", { required: false })}
              error={errors?.telefono != null}
              id="telefono"
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

            <Button type="submit" disabled={disabled}>
              Registrar
            </Button>
          </Form>
        </article>
        <article className="flex flex-col gap-5 flex-1 min-w-[500px]">
          <div className="h-20"></div>
          {listado
            .filter((obj) => obj.curso.turno == 1)
            .map((obj) => (
              <>
                {obj.alumnos.length > 0 && (
                  <>
                    <Overline>Turno Tarde</Overline>
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
                          {obj.alumnos.length == 0 && (
                            <Typography className="text-slate-400 font-xs p-1 pl-4">
                              No se cargaron alumnos
                            </Typography>
                          )}
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
                  </>
                )}
              </>
            ))}
          {listado
            .filter((obj) => obj.curso.turno == 2)
            .map((obj) => (
              <>
                {obj.alumnos.length > 0 && (
                  <>
                    <Overline>Turno Tarde</Overline>
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
                          {obj.alumnos.length == 0 && (
                            <Typography className="text-slate-400 font-xs p-1 pl-4">
                              No se cargaron alumnos
                            </Typography>
                          )}
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
                  </>
                )}
              </>
            ))}
        </article>
      </section>
    </MainLayout>
  );
};

export default registrar;
