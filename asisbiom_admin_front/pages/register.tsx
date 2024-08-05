import { MainLayout, Overline } from "@/components";
import { Login } from "@mui/icons-material";
import { Button, Card, CardContent, FormControl, TextField, Typography } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";

export function Register() {

    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
    } = useForm();
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("Error desconocido");
    const [success, setSuccess] = useState<boolean>(false);

    function submitevent(data: any) {
        localStorage.setItem("enable-note-info-chip", "on");
        if (data.pwd_confirm != data.pwd) {
            setError(true);
            setErrorMessage("Las contraseñas no coinciden");
            return;
        } else {
            setError(false);
        }

        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/v1/register`, data)
            .then((res: any) => {
                console.log(res.data)
                setSuccess(true);
            })
            .catch((err) => {
                setError(true);
                setErrorMessage(err.response.data);
            });
    }

    return (
        <MainLayout title="Iniciar Sesión">
            <section className="flex flex-wrap w-full gap-4">
                <article className="p-6 flex flex-col gap-5 flex-1 w-full h-full absolute justify-center items-center">
                    {success ?
                        <Card>
                            <CardContent className="flex flex-col gap-6 p-4 items-center">
                                <Typography variant="caption">Bienvenido a ASISBIOM</Typography>
                                <Overline>Cuenta creada con éxito!</Overline>
                                <Image className="pb-4" alt="eetp612 icon" src={"/icons/eetp612.png"} width={300} height={300} />
                                <Button fullWidth variant="outlined" href="/signin" startIcon={<Login />}>Ingresar</Button>
                            </CardContent>
                        </Card>
                        :
                        <Form
                            control={control}
                            onSubmit={
                                handleSubmit(
                                    submitevent
                                ) as unknown as FormSubmitHandler<FieldValues>
                            }
                            className="p-4 border rounded-md w-[500px] flex flex-col gap-4"
                        >
                            <Overline>Crear una cuenta</Overline>
                            {error && (
                                <Typography color={"red"}>
                                    {errorMessage}
                                </Typography>)}
                            <FormControl>
                                <TextField
                                    placeholder="Nombre Completo"
                                    {...register("nombre_completo", { required: true })}
                                    type="text"
                                ></TextField>
                                {errors.email && (
                                    <Typography color={"red"}>Este campo es necesario</Typography>
                                )}
                            </FormControl> <FormControl>
                                <TextField
                                    placeholder="Nro. de documento (DNI)"
                                    {...register("dni", { required: true })}
                                    type="number"
                                    inputProps={{ maxLength: 8 }}
                                ></TextField>
                                {errors.email && (
                                    <Typography color={"red"}>Este campo es necesario</Typography>
                                )}
                            </FormControl>
                            <FormControl>
                                <TextField
                                    placeholder="Correo electrónico"
                                    {...register("email", { required: true })}
                                    type="email"
                                ></TextField>
                                {errors.email && (
                                    <Typography color={"red"}>Por favor utilice un correo electrónico válido</Typography>
                                )}
                            </FormControl>
                            <FormControl>
                                <TextField
                                    placeholder="Nro. de Teléfono"
                                    {...register("phone", { required: true })}
                                    inputProps={{ maxLength: 10 }}
                                ></TextField>
                                {errors.phone && (
                                    <Typography color={"red"}>Por favor use un número de teléfono válido</Typography>
                                )}
                            </FormControl>
                            <FormControl>
                                <TextField
                                    placeholder="Contraseña"
                                    {...register("pwd", { required: true })}
                                    type="password"
                                ></TextField>
                                {errors.password && (
                                    <Typography color={"red"}>Este campo es obligatorio</Typography>
                                )}
                            </FormControl>
                            <FormControl>
                                <TextField
                                    placeholder="Confirmar Contraseña"
                                    {...register("pwd_confirm", { required: true })}
                                    type="password"
                                ></TextField>
                                {errors.password && (
                                    <Typography color={"red"}>Este campo es obligatorio</Typography>
                                )}
                            </FormControl>
                            <Button type="submit" variant="contained">
                                Ingresar
                            </Button>
                        </Form>
                    }
                </article>
            </section>
        </MainLayout>
    );
}

export default Register;
