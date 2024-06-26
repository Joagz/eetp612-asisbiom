import { MainLayout, Overline } from "@/components";
import { Button, FormControl, InputLabel, TextField } from "@mui/material";
import { Form, useForm } from "react-hook-form";

export function SignIn() {

    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
    } = useForm();

    function submitevent() {

    }

    return (
        <MainLayout title="Signin">
            <section className="flex flex-wrap w-full gap-4">
                <article className="p-6 flex flex-col gap-5 flex-1 w-full h-full absolute justify-center items-center">
                    <div className="h-10"></div>
                    <Form
                        control={control}
                        onSubmit={handleSubmit(submitevent)}
                        className="p-4 border rounded-md w-[500px] flex flex-col gap-4">
                        <Overline>Iniciar Sesión</Overline>
                        <FormControl>
                            <TextField placeholder="Correo electrónico" {...register("email", { required: true })} type="email"></TextField>
                        </FormControl>
                        <FormControl>
                            <TextField placeholder="Contraseña" {...register("password", { required: true })} type="email"></TextField>
                        </FormControl>
                        <Button type="submit" variant="contained">Ingresar</Button>
                    </Form>
                </article>
            </section>
        </MainLayout>
    )



}

export default SignIn;