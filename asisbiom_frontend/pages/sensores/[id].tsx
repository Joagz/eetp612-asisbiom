import { useEffect, useState } from 'react'
import { PrincipalLayout } from '@/components';
import mqtt from 'mqtt';
import { useApi } from '@/hooks/useApi';
import Alumno from '@/interface/Alumno';
import MqttMessage from '@/interface/MqttMessage';
import User from '@/interface/User';
import Roles from '@/interface/Roles';
import { Close, Warning } from '@mui/icons-material';
import { Alert, Button } from '@mui/material';
import { useRouter } from 'next/router';


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

enum MqttActions {
    MQTT_ACTION_AUTH,
    MQTT_ACTION_REGISTER,
    MQTT_ACTION_CONFIRM,
    MQTT_ACTION_PING,
    MQTT_ACTION_PUT_FINGER,
    MQTT_ACTION_REMOVE_FINGER,
    MQTT_ACTION_COMPLETED,
    MQTT_ACTION_CONFIRMATION_COMPLETE
}

const SensorById = ({ id }: { id: number }) => {
    const { reload } = useRouter();
    const [alumno, setAlumno] = useState<Alumno>(
        {
            id: 1,
            dni: "48067866",
            nombreCompleto: "Joaquín Gómez",
            curso: {
                curso: 4,
                division: "A",
                id: 1
            },
            correoElectronico: "joagomez.dev@gmail.com",
            telefono: "3424680690"
        }
    );

    const [message, setMessage] = useState<string>("Esperando entrada...");

    const [materias, setMaterias] = useState<{
        id: number, horaInicio: number, horaFin: number, materia: {
            id: number, nombre: string
        }
    }[]>([]);

    const [stats, setStats] = useState<{
        tardanzas: number,
        retiros: number,
        diasHabiles: number,
        inasistencias1: number,
        inasistencias2: number,
        inasistencias3: number
    }>();
    const [notas, setNotas] = useState<{
        id: number;
        nivel_urgencia: number;
        asunto: string;
        fecha: string;
        vencimiento: string;
        contenido: string;
    }[]>([]);
    const [asistido, setAsistido] = useState<boolean>(false);
    const [retirar, setRetirar] = useState<boolean>(false);

    useEffect(() => {
        const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_URL!, options);

        client.on("connect", () => {
            console.log("Connected");
            client.subscribe("mqtt_sensor_out");
        });

        client.on("message", (topic, message) => {
            const recv = message.toString();
            useApi<MqttMessage>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/sensor/last-message/${id}` }).then(res => {
                // Conseguir la data del alumno
                if (res.data.sensorId != id) {
                    return;
                }

                if (res.data.action == MqttActions.MQTT_ACTION_AUTH) {
                    useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/${res.data.alumnoId}` }).then(alumnoRes => {
                        setAlumno(alumnoRes.data)

                        useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/materia/${alumnoRes.data.curso.id}` })
                            .then(cursoRes => {
                                setMaterias(cursoRes.data)
                            }).catch(err => { setMaterias([]) })
                        useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/stats/${alumnoRes.data.id}` })
                            .then(statsRes => {
                                setStats(statsRes.data[0]);
                            })
                        useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/nota/${alumnoRes.data.id}` })
                            .then(notasRes => {
                                setNotas(notasRes.data);
                            })
                        useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/asistir/${res.data.alumnoId}?set=true`, method: "POST" }).then(
                            assistRes => {
                                console.log(assistRes.data)
                                setAsistido(assistRes.data.response == "OK")
                            }
                        )
                    })
                } else if (res.data.action == MqttActions.MQTT_ACTION_PUT_FINGER) {
                    setMessage("Por favor coloque el dedo en el sensor.");
                } else if (res.data.action = MqttActions.MQTT_ACTION_REMOVE_FINGER) {
                    setMessage("Retire el dedo del sensor.");
                } else if (res.data.action == MqttActions.MQTT_ACTION_CONFIRM) {
                    if (!alumno) {
                        setMessage("No se puede retirar a un alumno ya que no hay alumno registrado en este momento.");
                        return;
                    }
                    setMessage("Esperando confirmación de un miembro del personal.");
                    setRetirar(true);
                } else if (res.data.action == MqttActions.MQTT_ACTION_CONFIRMATION_COMPLETE) {
                    // buscar usuario
                    if (alumno && retirar) {

                        useApi<User>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/${res.data.alumnoId}` })
                            .then(res => {
                                if ([Roles.PRECEPTOR, Roles.DIRECTIVO, Roles.SECRETARIO, Roles.PROFESOR].includes(res.data.role)) {
                                    useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/retirar/${alumno.id}`, method: "POST" }).then(retirarRes => (
                                        setMessage(`Alumno ${alumno.nombreCompleto} retirado con éxito`)
                                    )).catch(err =>
                                        setMessage("No se pudo retirar al alumno")
                                    )
                                }
                            })
                    } else setMessage("No se puede retirar a un alumno ya que no hay alumno registrado en este momento.")
                } else if (res.data.action == MqttActions.MQTT_ACTION_COMPLETED) {
                    setMessage("Alumno registrado con éxito! Bienvenido/a");
                }

            })
        });

        return () => {
            if (client) {
                client.unsubscribe('test');
                client.end();
            }
        };
    }, [])

    return (
        <PrincipalLayout disableFooter title={`Sensor ${id}`}>
            <div className='flex h-screen py-5 w-full justify-center items-center flex-col'>
                {alumno && !retirar ?
                    <div className='flex gap-4 w-full h-full'>
                        <div className='flex flex-col gap-4 flex-1 min-w-64'>
                            <div className='w-full className="text-white hover:scale-95 transition-all snap-center border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg gap-2"'>
                                <span className='italic'>{asistido ? "Asistido correctamente" : "No se pudo asistir"}</span>
                                <br />
                                <span className='font-bold text-xl'>{alumno.nombreCompleto}</span>
                                <br />
                                <span className=''>Curso: {alumno.curso.curso}{' '}</span>
                                <span className=''>"{alumno.curso.division}"</span>
                            </div>
                            <Button color='error' variant='contained' className='flex text-xl font-bold' onClick={() => reload()}><Close /> Salir</Button>
                            <div className='w-full h-full overflow-auto className="text-white hover:scale-95 transition-all snap-center border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg gap-2"'>
                                <p className='font-bold text-lg'>Inasistencias</p>
                                <p className='ml-6 font-medium'>1er Trimestre: {stats?.inasistencias1}</p>
                                <p className='ml-6 font-medium'>2do Trimestre: {stats?.inasistencias2}</p>
                                <p className='ml-6 font-medium'>3er Trimestre: {stats?.inasistencias3}</p>
                                <p className='ml-6 font-medium'>Tardanzas: {stats?.tardanzas}</p>
                                <p className='ml-6 font-medium'>Retirado {stats?.retiros} veces</p>

                                <br />
                                <p className='font-bold text-lg'>Materias de hoy</p>
                                {materias.length == 0 && <p>No hay materias hoy.</p>}
                                {materias?.length > 0 && <table className='w-full'>
                                    <thead>
                                        <tr>
                                            <th className='text-left'>Nombre</th>
                                            <th className='text-left'>Hora</th>
                                            <th className='text-left'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {materias?.map(materia => (
                                            <tr key={materia.materia.id}>
                                                <td>{materia.materia.nombre}</td>
                                                <td>{materia.horaInicio}°</td>
                                                <td>{materia.horaFin}°</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>}
                            </div>
                        </div>
                        {notas.length > 0 &&
                            <div className="w-full max-h-full overflow-auto flex-col flex text-white hover:scale-95 transition-all snap-center border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg gap-2">
                                {notas.map(nota =>
                                    <div className={`${nota.nivel_urgencia == 0 && 'bg-slate-900'}
                                                    ${nota.nivel_urgencia == 1 && 'bg-green-900'}
                                                    ${nota.nivel_urgencia == 2 && 'bg-yellow-900'}
                                                    ${nota.nivel_urgencia == 3 && 'bg-red-900'}
                                                    rounded-md p-2`}>
                                        <span className='font-medium'>{nota.asunto}</span>
                                        <p className='text-sm'>{nota.contenido}</p>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                    : retirar && alumno ? <>
                        <div className='w-full h-[1px] bg-white'></div>
                        <div className='h-4' />
                        <h1 className='text-2xl font-semibold'>EETP N. 612</h1>
                        <h3 className='text-md font-semibold text-2xl'><Warning fontSize='large' /></h3>
                        <div className='h-4' />
                        <div className='w-full h-[1px] bg-white'></div>
                        <div className='h-4' />
                        <p className='text-2xl font-bold'>{message}</p>
                    </> :
                        <>
                            <div className='w-full h-[1px] bg-white'></div>
                            <div className='h-4' />
                            <h1 className='text-2xl font-semibold'>EETP N. 612</h1>
                            <h3 className='text-md font-semibold'>Eudocio de los Santos Giménez</h3>
                            <div className='h-4' />
                            <div className='w-full h-[1px] bg-white'></div>
                            <div className='h-4' />
                            <p className='text-2xl font-bold'>{message}</p>
                        </>
                }
            </div>
        </PrincipalLayout>
    )
}

SensorById.getInitialProps = async ({ query }: any) => {
    const { id } = query;
    return { id };
};

export default SensorById