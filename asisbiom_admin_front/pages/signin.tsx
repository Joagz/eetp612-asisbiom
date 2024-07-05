import { MainLayout, Overline } from "@/components";
import { Button, FormControl, TextField, Typography } from "@mui/material";
import axios from "axios";
import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";

export function SignIn() {
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/v1/user`, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            btoa(
              unescape(encodeURIComponent(data.email + ":" + data.password))
            ),
        },
      })
      .then((res: any) => {
        let authHeader: any = res.headers.get("authorization");
        if (authHeader && process.env.NEXT_PUBLIC_JWT_COOKIE) {
          setCookie(process.env.NEXT_PUBLIC_JWT_COOKIE, authHeader, {
            maxAge: 86000,
          });
          router.replace("/");
        }
      })
      .catch((err) => {
        setError(true);
        if (process.env.NEXT_PUBLIC_JWT_COOKIE)
          deleteCookie(process.env.NEXT_PUBLIC_JWT_COOKIE);
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
            <Overline>Iniciar Sesión</Overline>
            {error && (
              <Typography color={"red"}>
                "Email o contraseña inválidos"
              </Typography>
            )}
            <FormControl>
              <TextField
                placeholder="Correo electrónico"
                {...register("email", { required: true })}
                type="email"
              ></TextField>
              {errors.email && (
                <Typography>Este campo es obligatorio</Typography>
              )}
            </FormControl>
            <FormControl>
              <TextField
                placeholder="Contraseña"
                {...register("password", { required: true })}
                type="password"
              ></TextField>
              {errors.password && (
                <Typography>Este campo es obligatorio</Typography>
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

export default SignIn;
