import { useEffect, useState } from 'react'
import { PrincipalLayout } from '@/components';
import mqtt from 'mqtt';
import { useApi } from '@/hooks/useApi';
import Alumno from '@/interface/Alumno';


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



const SensorById = ({ id }: { id: number }) => {
    const [alumno, setAlumno] = useState<Alumno>(
        // {
        //     id: 1,
        //     dni: "48067866",
        //     nombreCompleto: "Joaquín Gómez",
        //     curso: {
        //         curso: 4,
        //         division: "A",
        //         id: 1
        //     },
        //     correoElectronico: "joagomez.dev@gmail.com",
        //     telefono: "3424680690"
        // }
    );
    const [materias, setMaterias] = useState<{
        id: number, horaInicio: number, horaFin: number, materia: {
            id: number, nombre: string
        }
    }[]>();

    const [stats, setStats] = useState<{
        tardanzas: number,
        retiros: number,
        diasHabiles: number,
        inasistencias1: number,
        inasistencias2: number,
        inasistencias3: number
    }>();

    const [asistido, setAsistido] = useState<boolean>(false);

    useEffect(() => {
        const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_URL!, options);

        client.on("connect", () => {
            console.log("Connected");
            client.subscribe("mqtt_sensor_out");
        });

        client.on("message", (topic, message) => {
            const recv = message.toString();
            useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/sensor/last-message/${id}` }).then(res => {
                // Conseguir la data del alumno

                useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/${res.data.alumnoId}` }).then(alumnoRes => {
                    setAlumno(alumnoRes.data)

                    useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/materia/${alumnoRes.data.curso.id}` })
                        .then(cursoRes => {
                            setMaterias(cursoRes.data)
                        })
                    useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/stats/${alumnoRes.data.id}` })
                        .then(statsRes => {
                            setStats(statsRes.data[0]);
                        })
                    useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/asistir/${res.data.alumnoId}?set=true`, method: "POST" }).then(
                        assistRes => {
                            console.log(assistRes.data)
                            setAsistido(assistRes.data.response == "OK")
                        }
                    )


                })

            })
            console.log("Mensaje:", recv);
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
                {alumno ?
                    <div className='flex gap-4 w-full h-full'>
                        <div className='flex flex-col gap-4 flex-1 min-w-64'>
                            <div className='w-full className="text-white hover:scale-95 transition-all snap-center border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg gap-2"'>
                                <span className='italic'>Bienvenido/a</span>
                                <br />
                                <span className='font-bold text-xl'>{alumno.nombreCompleto}</span>
                                <br />
                                <span className=''>Curso: {alumno.curso.curso}{' '}</span>
                                <span className=''>"{alumno.curso.division}"</span>
                            </div>
                            <div className='w-full h-full overflow-auto className="text-white hover:scale-95 transition-all snap-center border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg gap-2"'>
                                <p className='font-bold text-lg'>Inasistencias</p>
                                <p className='ml-6 font-medium'>1er Trimestre: {stats?.inasistencias1}</p>
                                <p className='ml-6 font-medium'>2do Trimestre: {stats?.inasistencias2}</p>
                                <p className='ml-6 font-medium'>3er Trimestre: {stats?.inasistencias3}</p>
                                <p className='ml-6 font-medium'>Tardanzas: {stats?.tardanzas}</p>
                                <p className='ml-6 font-medium'>Retirado {stats?.retiros} veces</p>
                                
                                <br />
                                <p className='font-bold text-lg'>Materias de hoy</p>
                                <table className='w-full'>
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
                                </table>
                            </div>
                        </div>
                        <div className="w-full max-h-full gap-2 overflow-auto flex-col flex text-white hover:scale-95 transition-all snap-center border hover:bg-opacity-90 lg:p-7 p-3 rounded-lg bg-opacity-50 backdrop-blur-lg gap-2">
                            <div className='bg-slate-900 rounded-md p-2'>
                                <span className='font-medium'>Esto es una nota predeterminada</span>
                                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis temporibus amet itaque dolore libero possimus voluptatibus provident ipsam! Odit, distinctio.</p>
                            </div>
                            <div className='bg-green-900 rounded-md p-2'>
                                <span className='font-medium'>Esto es una nota de baja prioridad</span>
                                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis temporibus amet itaque dolore libero possimus voluptatibus provident ipsam! Odit, distinctio.</p>
                            </div>
                            <div className='bg-yellow-900 rounded-md p-2'>
                                <span className='font-medium'>Esto es una nota de prioridad media</span>
                                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis temporibus amet itaque dolore libero possimus voluptatibus provident ipsam! Odit, distinctio.</p>
                            </div>
                            <div className='bg-red-900 rounded-md p-2'>
                                <span className='font-medium'>Esto es una nota importante</span>
                                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis temporibus amet itaque dolore libero possimus voluptatibus provident ipsam! Odit, distinctio.</p>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <div className='w-full h-[1px] bg-white'></div>
                        <div className='h-4' />
                        <h1 className='text-2xl font-semibold'>EETP N. 612</h1>
                        <h3 className='text-md font-semibold'>Eudocio de los Santos Giménez</h3>
                        <div className='h-4' />
                        <div className='w-full h-[1px] bg-white'></div>
                        <div className='h-4' />
                        <p className='text-2xl font-bold'>Por favor coloque su dedo...</p>
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