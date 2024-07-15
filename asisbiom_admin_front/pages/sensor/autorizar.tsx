import { MainLayoutFixedHeight, Paragraph, Title } from "@/components";
import { useApi } from "@/hooks";
import Roles from "@/interface/Roles";
import { SubdirectoryArrowRight, Warning } from "@mui/icons-material";
import { Button, Paper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import router from "next/router";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";



interface UserDto {
    pwd: string,
    email: string,
    phone: string
    id_role: string,
}

export function AuthorizeSensor() {

    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
    } = useForm();

    function submitevent(data: { device_id: string, device_secret: string }) {
        const user: UserDto = {
            email: data.device_id,
            id_role: Roles.SENSOR,
            phone: "",
            pwd: data.device_secret
        }

        useApi<any>({ url: `${process.env.NEXT_PUBLIC_API_URL}/auth/v1/register?is_sensor=true`, body: user, method: "POST" }).then(
            res => console.log(res)
        ).catch(err => console.log(err))

        router.replace("/sensor");
    }


    return (
        <MainLayoutFixedHeight title={"Autorizar"} >

            <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-4">

                <Title className="text-xl mb-2">Autorizar nuevo sensor</Title>
                <Paragraph>Al autorizar un nuevo sensor, estará creando un perfil para un dispositivo. Ésto le dará acceso a los datos de la aplicación.</Paragraph>
                <div className="flex w-full justify-around my-4 gap-4">
                    <Paper className="flex-1">
                        <ul className="w-full mt-2 p-4">
                            <li className="text-md">Las bases de datos de:</li>
                            <li className="text-sm"><SubdirectoryArrowRight /> Alumnos</li>
                            <li className="text-sm"><SubdirectoryArrowRight /> Profesores</li>
                            <li className="text-sm"><SubdirectoryArrowRight /> Horarios</li>
                            <li className="text-sm"><SubdirectoryArrowRight /> Materias</li>
                        </ul>
                    </Paper>

                    <Paper className="flex-1">
                        <ul className="w-full mt-2 p-4">
                            <li className="text-md">Permisos para:</li>
                            <li className="text-sm"><SubdirectoryArrowRight /> Asistir y retirar alumnos</li>
                            <li className="text-sm"><SubdirectoryArrowRight /> Computar inasistencias, tardanzas, etc.</li>
                        </ul>
                    </Paper>
                </div>
                <Typography variant="caption" className="flex justify-center items-center"><Warning color="error" fontSize="small" />Ten en cuenta que si los datos de un sensor se ven comprometidos deberá{' '}<Link className="text-red-600 hover:text-red-400 ml-1" href={"/sensores"}>{' '}eliminar el usuario y registrar uno nuevo</Link>.</Typography>
                <div className="h-10" />

                <Form control={control}
                    onSubmit={handleSubmit(submitevent) as unknown as FormSubmitHandler<FieldValues>}
                    className="flex gap-4 flex-col">

                    <TextField placeholder="ID del sensor" {...register('device_id', { required: true })}></TextField>
                    {errors.device_id && <p>Este campo es obligatorio</p>}

                    <TextField type="password" placeholder="Código" {...register('device_secret', { required: true })}></TextField>
                    {errors.device_secret && <p>Este campo es obligatorio</p>}

                    <Button type="submit" color="info" variant="contained">Registrar Sensor</Button>
                </Form>
                <Paragraph>Una vez creada la cuenta, podrá registrar el sensor desde la <Link target="_blank" className="text-blue-600 hover:text-blue-400" href={"http://localhost:3001"}>aplicación de control del sensor</Link>.</Paragraph>
            </div>

        </MainLayoutFixedHeight >
    );
}


export default AuthorizeSensor;