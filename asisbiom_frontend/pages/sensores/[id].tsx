import { useEffect, useState } from 'react'
import { PrincipalLayout } from '@/components';
import { useApi } from '@/hooks/useApi';
import mqtt, { MqttClient } from 'mqtt';
import useMqtt from '@/hooks/useMqtt';

const options = {
    userName: 'SensorFront',
    password: '',
    clientId: 'nextjs',
    reconnectPeriod: 1000000,
};

const mqttUri = 'wss://localhost:8084';

const SensorById = ({ id }: { id: number }) => {
    const [messages, setMessages] = useState(['init']);
    useMqtt({uri: mqttUri, options: options})

    return (
        <PrincipalLayout title={`Sensor ${id}`}>
            <div className='flex justify-center items-center flex-col'>
                <ul>
                    {messages.map((message) => (
                        <li key={Math.random()}>{message.toString()}</li>
                    ))}
                </ul>                <h1 className='text-2xl font-bold'>EETP N. 612</h1>
                <p>Por favor coloque su dedo...</p>
            </div>
        </PrincipalLayout>
    )
}

SensorById.getInitialProps = async ({ query }: any) => {
    const { id } = query;
    return { id };
};

export default SensorById