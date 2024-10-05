import { useEffect, useState } from "react";
import { PrincipalLayout } from "@/components";
import mqtt from "mqtt";
import { useApi } from "@/hooks/useApi";
import Alumno from "@/interface/Alumno";
import User from "@/interface/User";
import Roles from "@/interface/Roles";
import { Close, Done, ExitToApp, Warning } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";

const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

const options: any = {
  keepalive: 30,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
  rejectUnauthorized: false,
};

enum MqttCodes {
  MQTT_ACTION_AUTH,
  MQTT_ACTION_REGISTER,
  MQTT_ACTION_CONFIRM,
  MQTT_ACTION_PING,
  MQTT_ACTION_PUT_FINGER,
  MQTT_ACTION_REMOVE_FINGER,
  MQTT_ACTION_COMPLETED,
  MQTT_ACTION_CONFIRMATION_COMPLETE,
  MQTT_ACTION_REGISTER_COMPLETE,

  // Errors
  MQTT_ERROR_AUTH_FAILED = 0xf0,
  MQTT_ERROR_REGISTER_FAILED = 0xf1,
  MQTT_ERROR_CONFIRM_FAILED = 0xf2,
}

const SensorById = ({ id }: { id: number }) => {
  function register_action(data: any) {
    setMessage(
      "Registrando nuevo usuario con ID #" +
        data.alumnoId +
        ". Coloque su dedo por favor"
    );
    setOnAction(true);
    setShowBtn(false);
  }

  const { reload } = useRouter();
  const [alumno, setAlumno] = useState<Alumno>();

  const [message, setMessage] = useState<string>("Esperando entrada...");

  const [materias, setMaterias] = useState<
    {
      id: number;
      horaInicio: number;
      horaFin: number;
      materia: {
        id: number;
        nombre: string;
      };
    }[]
  >([]);

  const [stats, setStats] = useState<{
    tardanzas: number;
    retiros: number;
    diasHabiles: number;
    inasistencias1: number;
    inasistencias2: number;
    inasistencias3: number;
  }>();
  const [notas, setNotas] = useState<
    {
      id: number;
      nivel_urgencia: number;
      asunto: string;
      fecha: string;
      vencimiento: string;
      contenido: string;
    }[]
  >([]);
  const [asistido, setAsistido] = useState<boolean>(false);
  const [retirado, setRetirado] = useState<boolean>(false);
  const [onAction, setOnAction] = useState<boolean>(false);
  const [showBtn, setShowBtn] = useState<boolean>(false);

  function retirarAlumno(alumno: number) {
    setRetirado(false);
    if (alumno)
      useApi<any>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/sensor/confirm-retirar/${id}/${alumno}`,
        method: "POST",
      }).then((res) => {
        console.log(res.data);
      });
  }

  useEffect(() => { 
    const client = mqtt.connect(
      process.env.NEXT_PUBLIC_MQTT_SERVER_URI!,
      options
    );

    client.on("connect", () => {
      console.log("Connected");
      client.subscribe("mqtt_sensor_out");
    });

    client.on("message", (topic, message) => {
      console.log(message.toString());
      useApi<any>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/sensor/parse`,
        body: message.toString(),
        method: "POST",
      }).then((res) => {
        console.log(message.toString())

        switch (res.data.action) {
          case MqttCodes.MQTT_ACTION_COMPLETED:
            setMessage("Registrado con éxito! Bienvenido/a");
            setOnAction(true);
            break;

          case MqttCodes.MQTT_ACTION_AUTH:
            useApi<any>({
              url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/finger/${res.data.alumnoId}`,
            }).then((alumnoRes) => {
              setAlumno(alumnoRes.data);
              if (alumnoRes.data) {
                useApi<any>({
                  url: `${process.env.NEXT_PUBLIC_API_URL}/api/materia/${alumnoRes.data.curso.id}`,
                })
                  .then((cursoRes) => {
                    setMaterias(cursoRes.data);
                  })
                  .catch((err) => {
                    setMaterias([]);
                  });
                useApi<any>({
                  url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/stats/${alumnoRes.data.id}`,
                }).then((statsRes) => {
                  setStats(statsRes.data[0]);
                });
                useApi<any>({
                  url: `${process.env.NEXT_PUBLIC_API_URL}/api/nota/${alumnoRes.data.id}`,
                }).then((notasRes) => {
                  setNotas(notasRes.data);
                });
                useApi<any>({
                  url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/asistir/${res.data.alumnoId}?set=true`,
                  method: "POST",
                }).then((assistRes) => {
                  console.log(assistRes.data);
                  setAsistido(assistRes.data.response == "OK");
                });
              } else {
                setMessage("La huella no coincide con ningún registro");
              }
            });
            break;
          case MqttCodes.MQTT_ACTION_REGISTER:
            register_action(res.data);
            break;

          case MqttCodes.MQTT_ACTION_REGISTER_COMPLETE:
            setMessage("Registrado con éxito! Bienvenido/a");
            setOnAction(false);
            setShowBtn(true);

            break;

          case MqttCodes.MQTT_ACTION_PUT_FINGER:
            setMessage("Por favor coloque el mismo dedo nuevamente");
            setOnAction(true);
            break;

          case MqttCodes.MQTT_ACTION_REMOVE_FINGER:
            setMessage("Retire el dedo del sensor");
            setOnAction(true);
            return;

          case MqttCodes.MQTT_ACTION_CONFIRM:
            setMessage("Esperando confirmación de un miembro del personal");
            setOnAction(true);
            return;

          case MqttCodes.MQTT_ACTION_CONFIRMATION_COMPLETE:
            useApi<User>({
              url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/finger/${res.data.alumnoId}`,
            })
              .then((userRes) => {
                console.log(userRes.data);
                if (
                  [
                    Roles.PRECEPTOR,
                    Roles.DIRECTIVO,
                    Roles.SECRETARIO,
                    Roles.PROFESOR,
                    Roles.DEVELOPER,
                  ].includes(userRes.data.role)
                ) {
                  setConfirmandoRetiro(true);
                  setProfesor(userRes.data);
                } else {
                  setMessage(
                    "El ROL del usuario no tiene permiso para retirar"
                  );
                }
              })
              .catch((err) => {
                setMessage("Acceso Restringido, usuario no válido");
              });

            setShowBtn(true);
            setOnAction(true);
            break;

          case MqttCodes.MQTT_ERROR_REGISTER_FAILED:
            setMessage("Error al registrar, intentando nuevamente");
            break;
        }
      });
    });

    return () => {
      if (client) {
        client.unsubscribe("test");
        client.end();
      }
    };
  }, []);

  const [razonRetiro, setRazonRetiro] = useState<string>();
  const [confirmandoRetiro, setConfirmandoRetiro] = useState<boolean>(false);
  const [profesor, setProfesor] = useState<User>();

  return (
    <PrincipalLayout disableFooter title={`Sensor ${id}`}>
      <div className="flex h-screen py-5 w-full justify-center items-center flex-col">
        <FormDialog
          setRazonRetiro={setRazonRetiro}
          setOpen={setConfirmandoRetiro}
          open={confirmandoRetiro}
          handleClose={function (retirar: boolean, razon: string): void {
            if (!retirar) {
              setConfirmandoRetiro(false);
            }
            if (alumno) {
              useApi<any>({
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/retirar/${alumno.id}`,
                method: "POST",
              })
                .then((retirarRes) => {
                  useApi<any>({
                    url: `${process.env.NEXT_PUBLIC_API_URL}/api/retiro/${alumno.id}/${profesor?.id}/${razon}`,
                    method: "POST",
                  })
                    .then((res) => {
                      setRetirado(true);
                      setMessage("Alumno retirado con éxito");
                      console.log(res);
                    })
                    .catch((err) => {
                      setMessage(err.response.data || "No se puede retirar");
                      setRetirado(false);
                      console.log({
                        razon: razon,
                        alumno: alumno.id,
                        profesor_id: profesor?.id,
                      });
                      console.log("No se puede retirar");
                    });
                })
                .catch((err) => {
                  setMessage(err.response.data);
                  setRetirado(false);
                  console.log("No se puede retirar");
                });
            } else {
              setRetirado(false);
              setMessage("No hay un alumno autenticado");
            }
            setOnAction(true);
            setShowBtn(true);
          }}
        />
        {alumno && !onAction ? (
          <div className="flex gap-4 w-full h-full">
            <div className="flex flex-col gap-4 flex-1 min-w-64">
              <div className='w-full className="text-white hover:scale-95 transition-all snap-center border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg gap-2"'>
                <span className="italic">
                  {asistido ? "Asistido correctamente" : "No se pudo asistir"}
                </span>
                <br />
                <span className="font-bold text-xl">
                  {alumno.nombreCompleto}
                </span>
                <br />
                <span className="">Curso: {alumno.curso.curso} </span>
                <span className="">"{alumno.curso.division}"</span>
              </div>
              <Button
                color="error"
                variant="contained"
                className="flex text-xl font-bold"
                onClick={() => reload()}
              >
                <Close /> Salir
              </Button>
              <div className='w-full h-full overflow-auto className="text-white hover:scale-95 transition-all snap-center border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg gap-2"'>
                <p className="font-bold text-lg">Inasistencias</p>
                <p className="ml-6 font-medium">
                  1er Trimestre: {stats?.inasistencias1}
                </p>
                <p className="ml-6 font-medium">
                  2do Trimestre: {stats?.inasistencias2}
                </p>
                <p className="ml-6 font-medium">
                  3er Trimestre: {stats?.inasistencias3}
                </p>
                <p className="ml-6 font-medium">
                  Tardanzas: {stats?.tardanzas}
                </p>
                <p className="ml-6 font-medium">
                  Retirado {stats?.retiros} veces
                </p>

                <br />
                <p className="font-bold text-lg">Materias de hoy</p>
                {materias.length == 0 && <p>No hay materias hoy.</p>}
                {materias?.length > 0 && (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Nombre</th>
                        <th className="text-left">Hora</th>
                        <th className="text-left"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {materias?.map((materia) => (
                        <tr key={materia.materia.id}>
                          <td>{materia.materia.nombre}</td>
                          <td>{materia.horaInicio}°</td>
                          <td>{materia.horaFin}°</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <Button
                color="warning"
                variant="contained"
                className="flex text-xl font-bold"
                onClick={() => retirarAlumno(alumno.id)}
              >
                <ExitToApp /> Retirar Alumno
              </Button>
            </div>
            {notas.length > 0 && (
              <div className="w-full max-h-full overflow-auto flex-col flex text-white hover:scale-95 transition-all snap-center border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg gap-2">
                {notas.map((nota) => (
                  <div
                    className={`${nota.nivel_urgencia == 0 && "bg-slate-900"}
                                                    ${
                                                      nota.nivel_urgencia ==
                                                        1 && "bg-green-900"
                                                    }
                                                    ${
                                                      nota.nivel_urgencia ==
                                                        2 && "bg-yellow-900"
                                                    }
                                                    ${
                                                      nota.nivel_urgencia ==
                                                        3 && "bg-red-900"
                                                    }
                                                    rounded - md p - 2`}
                  >
                    <span className="font-medium">{nota.asunto}</span>
                    <p className="text-sm">{nota.contenido}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : alumno && onAction ? (
          <>
            <div className="w-full h-[1px] bg-white"></div>
            <div className="h-4" />
            {/* <h1 className='text-2xl font-semibold'>EETP N. 612</h1> */}
            <h3 className="text-md font-semibold text-2xl">
              {retirado ? (
                <Done fontSize="large" />
              ) : (
                <Warning fontSize="large" />
              )}
            </h3>
            <div className="h-4" />
            <div className="w-full h-[1px] bg-white"></div>
            <div className="h-4" />
            <p className="text-2xl font-bold">{message}</p>
            {showBtn && (
              <>
                <Button
                  variant="outlined"
                  className="mt-8"
                  size="large"
                  color="inherit"
                  onClick={() => reload()}
                >
                  Aceptar
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <div className="w-full h-[1px] bg-white"></div>
            <div className="h-4" />
            <h1 className="text-2xl font-semibold">EETP N. 612</h1>
            <h3 className="text-md font-semibold">
              Eudocio de los Santos Giménez
            </h3>
            <div className="h-4" />
            <div className="w-full h-[1px] bg-white"></div>
            <div className="h-4" />
            <p className="text-2xl font-bold">{message}</p>
            {showBtn && (
              <>
                <Button
                  variant="outlined"
                  className="mt-8"
                  size="large"
                  color="inherit"
                  onClick={() => reload()}
                >
                  Aceptar
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </PrincipalLayout>
  );
};

function FormDialog({
  setRazonRetiro,
  open,
  setOpen,
  handleClose,
}: {
  setRazonRetiro: any;
  setOpen: any;
  open: boolean;
  handleClose: (retirar: boolean, razon: string) => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data: any) {
    setRazonRetiro(data.razon);
    setOpen(false);
    console.log(data);
    handleClose(true, data.razon);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <Form
        control={control}
        onSubmit={
          handleSubmit(onSubmit) as unknown as FormSubmitHandler<FieldValues>
        }
      >
        <DialogTitle>Razon de retiro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor escriba la razón por la que se retira al alumno
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Razón del retiro"
            type="text"
            fullWidth
            variant="standard"
            {...register("razon", { required: true })}
          />

          {errors.razon && <Typography>Debe colocar una razón</Typography>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              handleClose(false, "");
            }}
          >
            Cancelar
          </Button>
          <Button type="submit">Retirar</Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

SensorById.getInitialProps = async ({ query }: any) => {
  const { id } = query;
  return { id };
};

export default SensorById;
