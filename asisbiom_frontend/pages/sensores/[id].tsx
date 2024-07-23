import { useEffect, useState } from 'react'
import { PrincipalLayout } from '@/components';
import mqtt from 'mqtt';
import { useApi } from '@/hooks/useApi';


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
    const [alumno, setAlumno] = useState<any>();
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
                console.log(res.data);
                // Conseguir la data del alumno

                useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/${res.data.alumnoId}` }).then(alumnoRes => {
                    setAlumno(alumnoRes.data)
                    console.log(alumnoRes.data)
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
        <PrincipalLayout title={`Sensor ${id}`}>
            <div className='flex justify-center items-center flex-col'>
                {alumno ?
                    <>
                        <h1 className='text-2xl font-bold'>EETP N. 612</h1>
                        <p>Bienvenido/a <b>{alumno.nombreCompleto}</b></p>
                        {asistido ? <p>Asistido Correctamente</p> : <p>No se pudo asistir</p>}
                    </>
                    : <>
                        <h1 className='text-2xl font-bold'>EETP N. 612</h1>
                        <p>Por favor coloque su dedo...</p>
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