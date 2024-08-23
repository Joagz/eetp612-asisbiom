
import { MainLayoutFixedHeight, Paragraph, Title } from '@/components'
import { Button, TextareaAutosize, TextField } from '@mui/material'
import React from 'react'
import { FieldValues, Form, FormSubmitHandler, useForm } from 'react-hook-form'

type Props = {}

const Reportar = (props: Props) => {

    const {
        control,
        handleSubmit,
        register,
        formState: {
            errors
        }
    } = useForm();

    function submitevent(data: any) {

    }


    return (
        <MainLayoutFixedHeight title={'Reportar'}>
            <Title>Reportes y Ayuda</Title>

            <div className='w-full px-4 sm:w-3/4 flex flex-col gap-8'>
                <Paragraph>Este formulario está diseñado para proporcionar un canal seguro y confidencial para reportar casos de bullying, violencia o cualquier situación de vulnerabilidad que pueda estar afectando a alguien. Su propósito es permitir que cualquier persona, ya sea el estudiante, un miembro de su familia, docente o miembro de la comunidad, pueda informar sobre incidentes de manera directa y sin temor a represalias. La información recopilada a través de este formulario nos ayudará a tomar las medidas necesarias para abordar y resolver los problemas de manera efectiva, garantizando un entorno seguro y respetuoso para todos.</Paragraph>
                <Form className='flex flex-col gap-4' control={control} onSubmit={handleSubmit(submitevent) as unknown as FormSubmitHandler<FieldValues>}>
                    <div className='flex-col flex md:flex-row gap-4'>
                        <TextField className="flex-grow" placeholder='Nombre Completo' {...register("nombreCompleto", { required: true })} />
                        {errors.nombreCompleto && <p>Por favor indique su nombre</p>}
                        <TextField className="flex-grow" placeholder='Teléfono (opcional)' {...register("telefono", { required: false })} />
                        <TextField className="flex-grow" placeholder='Email (opcional)' {...register("email", { required: false })} />
                    </div>
                    <TextField className="flex-grow" placeholder='Asunto/Título' {...register("titulo", { required: true })} />
                    <TextareaAutosize cols={10} minRows={10} className='border rounded-sm border-gray-300 p-3' placeholder='Situación/Reporte'
                        {...register("situacion", { required: true })} style={{ resize: 'none' }} />
                    <Button variant='contained' color='success'>Enviar Reporte</Button>
                </Form>
            </div>
        </MainLayoutFixedHeight>
    )
}

export default Reportar