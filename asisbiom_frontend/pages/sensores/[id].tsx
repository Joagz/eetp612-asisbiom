import Head from 'next/head'
import React from 'react'
import { useRouter } from 'next/router'
import { PrincipalLayout } from '@/components';

const SensorById = () => {
    const router = useRouter();
    const sensorId = router.query.id;

    return (
        <PrincipalLayout title={`Sensor ${sensorId}`}>
            <div className='flex justify-center items-center flex-col'>
                <h1 className='text-2xl font-bold'>EETP N. 612</h1>
                <p>Por favor coloque su dedo...</p>
            </div>
        </PrincipalLayout>
    )
}

export default SensorById