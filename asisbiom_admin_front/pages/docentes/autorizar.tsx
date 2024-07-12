import { MainLayoutFixedHeight, Overline, Paragraph } from "@/components";
import { useApi } from "@/hooks";
import { Done, Warning } from "@mui/icons-material";
import { Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";

const Autorizar = () => {
    const router = useRouter();
    const params = useSearchParams();
    const [correo, setCorreo] = useState<string>("");
    const [message, setMessage] = useState<{ status: Boolean, msg: string }>();


    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
        reset
    } = useForm();

    useEffect(() => {
        setCorreo(params.get("correo") || "");
        errors.email = undefined;
        reset({ correo })
    }, [params, reset])

    function submitevent(data: any) {
        useApi<any[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/${data.email}` }).then(
            res => {
                if (res.data.length == 0) {
                    setMessage({ status: false, msg: `El usuario con E-mail "${data.email}" no fue encontrado.` })
                    return;
                }
                setMessage({ status: true, msg: 'Docente autorizado con éxito' })

                useApi({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/editrole/${data.email}?role=${data.cargo}`, method: "PUT" }).then(res => console.log(res.data));
            }
        )

        router.replace("/docentes");
    }

    return (
        <MainLayoutFixedHeight title="Autorizar Docente">
            <Form className="w-full md:w-1/2 flex flex-col gap-4" onSubmit={handleSubmit(submitevent) as unknown as FormSubmitHandler<FieldValues>} control={control}>
                <Overline>Autorización de Personal</Overline>
                <Paragraph>Al autorizar a un individuo, usted acepta otorgarle permisos en la aplicación de la institución. El cargo que usted elija debe corresponder al cargo del individuo dentro de la misma.</Paragraph>
                <i>Aclaración: la persona que usted desea autorizar debe estar registrada en la aplicación con el E-mail correspondiente.</i>

                {message &&
                    <Chip icon={message.status ? <Done /> : <Warning />} color={message.status ? 'success' : 'error'} label={message?.msg}></Chip>}

                <TextField
                    {...register("email", { required: true })}
                    value={correo}
                    onChange={(e: any) => setCorreo(e.target.value)}
                    placeholder="E-mail" error={errors.email != undefined}>
                </TextField>
                {errors.email && <Typography color={"red"} fontSize={15}>Este campo es necesario</Typography>}
                <FormControl fullWidth>
                    <InputLabel id="cargo">
                        Cargo
                    </InputLabel>
                    <Select
                        {...register("cargo", { required: true })}
                        label="Cargo"
                        labelId="Cargo"
                        defaultValue={params.get("cargo") || "PROFESOR"}
                    >
                        <MenuItem value={"USUARIO"}>USUARIO</MenuItem>
                        <MenuItem value={"PROFESOR"}>PROFESOR</MenuItem>
                        <MenuItem value={"PRECEPTOR"}>PRECEPTOR</MenuItem>
                        <MenuItem value={"SECRETARIO"}>SECRETARIO</MenuItem>
                        <MenuItem value={"DIRECTIVO"}>DIRECTIVO</MenuItem>
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="success" size="large">Autorizar</Button>
            </Form>
        </MainLayoutFixedHeight>
    );
}
export default Autorizar;