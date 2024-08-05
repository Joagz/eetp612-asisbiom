import { MainLayout, Overline } from "@/components";
import { Button, FormControl, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";

export function Register() {

    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
    } = useForm();
    const router = useRouter();
    const [error, setError] = useState<boolean>(false);

    function submitevent(data: any) {
        localStorage.setItem("enable-note-info-chip", "on");

        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/v1/register`)
            .then((res: any) => {
                console.log(res.data)
            })
            .catch((err) => {
                setError(true);
            });
    }

    return (
        <MainLayout title="Iniciar Sesión">
            <section className="flex flex-wrap w-full gap-4">
                <article className="p-6 flex flex-col gap-5 flex-1 w-full h-full absolute justify-center items-center">
                    <div className="h-10"></div>
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
                        <FormControl>
                            <TextField
                                placeholder="Nombre Completo"
                                {...register("email", { required: true })}
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
                            ></TextField>
                            {errors.email && (
                                <Typography color={"red"}>Este campo es necesario</Typography>
                            )}
                        </FormControl> <FormControl>
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
                                placeholder="Contraseña"
                                {...register("password", { required: true })}
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
                </article>
            </section>
        </MainLayout>
    );
}

export default Register;
