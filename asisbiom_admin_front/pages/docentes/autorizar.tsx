import { AlertDialog, MainLayoutFixedHeight, Overline, Paragraph } from "@/components";
import { SensorActions, useApi } from "@/hooks";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";

const Autorizar = () => {
    const params = useSearchParams();
    const [correo, setCorreo] = useState<string>("");
    const [message, setMessage] = useState<{ status: Boolean, msg: string }>();
    const { replace } = useRouter();

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
            userRes => {
                if (userRes.data.length == 0) {
                    setMessage({ status: false, msg: `El usuario con E-mail "${data.email}" no fue encontrado.` })
                    return;
                }

                useApi({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/editrole/${data.email}?role=${data.cargo}`, method: "PUT" }).then(res => {
                    if (userRes.data[0].fingerId == null) {
                        setMessage({ status: true, msg: 'Si da click a "Aceptar", el sensor esperará la huella del usuario para registrarla.' })
                        setOpenMessage(true)
                    } else {
                        replace("/docentes");
                    }
                });

            }
        )
    }

    const [openMessage, setOpenMessage] = useState(false);

    return (
        <MainLayoutFixedHeight title="Autorizar Docente">
            <Form className="w-full md:w-1/2 flex flex-col gap-4" onSubmit={handleSubmit(submitevent) as unknown as FormSubmitHandler<FieldValues>} control={control}>
                <Overline>Autorización de Personal</Overline>
                <Paragraph>Al autorizar a un individuo, usted acepta otorgarle permisos en la aplicación de la institución. El cargo que usted elija debe corresponder al cargo del individuo dentro de la misma.</Paragraph>
                <i>Aclaración: la persona que usted desea autorizar debe estar registrada en la aplicación con el E-mail correspondiente.</i>

                <AlertDialog onCancel={() => { replace("/docentes") }} onAccept={() => {
                    if (!correo) {
                        setMessage({ status: true, msg: "Debe haber un correo electrónico..." });
                        return;
                    }
                    // int sensorId, int alumnoId, int action, int messageId
                    useApi({ url: `${process.env.NEXT_PUBLIC_API_URL}/stats/finger` }).then(
                        res => {
                            useApi({
                                url: `${process.env.NEXT_PUBLIC_API_URL}/api/sensor/send-message`, method: "POST", body: {
                                    sensorId: 1,
                                    alumnoId: res.data,
                                    action: SensorActions.REGISTER
                                }
                            }).then(res => {
                                console.log(res);
                            });
                            useApi({
                                url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/finger-id/${correo}?id=${res.data}`, method: "PUT"
                            }).then(res => {
                                console.log(res.data)
                            })
                        }
                    )
                }} setOpen={setOpenMessage} open={openMessage} message={message?.msg || ""} message_title={"Registrar la huella del usuario"} />

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