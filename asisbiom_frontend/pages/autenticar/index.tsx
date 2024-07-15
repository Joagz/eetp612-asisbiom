import { PrincipalLayout } from "@/components";
import { useApi } from "@/hooks/useApi";
import Roles from "@/interface/Roles";
import axios from "axios";
import { setCookie, deleteCookie } from "cookies-next";
import router from "next/router";
import { useState } from "react";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";




const defaultErrorMessage="ID o Código incorrectos";
const invalidRoleErrorMessage="El usuario introducido no está habilitado";

export function AuthenticationPage() {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(defaultErrorMessage);

  const {
    register,
    formState: { errors },
    control,
    handleSubmit
  } = useForm();

  function submitevent(data: any) {
    console.log(data)
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/v1/user`, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            btoa(
              unescape(encodeURIComponent(data.device_id + ":" + data.device_secret))
            ),
        },
      })
      .then((res: any) => {
        let authHeader: any = res.headers.get("authorization");
        console.log(res.data)
        if (res.data.role != Roles.SENSOR) {
          setError(true);
          setErrorMessage(invalidRoleErrorMessage);
          return; // Not saving cookie
        }
        if (process.env.NEXT_PUBLIC_JWT_COOKIE) {
          setCookie(process.env.NEXT_PUBLIC_JWT_COOKIE, authHeader, {});
          router.replace("/");
        }
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(defaultErrorMessage);

        if (process.env.NEXT_PUBLIC_JWT_COOKIE) {
          deleteCookie(process.env.NEXT_PUBLIC_JWT_COOKIE);
          deleteCookie("username");
        }
      });
  }




  return (
    <PrincipalLayout title={"Autorizar"} >

      <h1 className="text-3xl font-semibold mb-2">Autorizar Dispositivo</h1>


      <Form control={control}
        onSubmit={handleSubmit(submitevent) as unknown as FormSubmitHandler<FieldValues>}
        className="flex gap-4 flex-col">
        {error && <p className="bg-red-300 w-full p-2 px-4 text-red-800 rounded-full">{errorMessage}</p>}

        <input className="p-3 text-black rounded-md border" type="text" placeholder="Id Del Dispositivo" {...register('device_id', { required: true })}></input>

        <input className="p-3 text-black rounded-md border" type="password" placeholder="Código" {...register('device_secret', { required: true })}></input>

        <button className="p-3 rounded-md border hover:scale-95 transition-all hover:bg-blue-50 hover:text-blue-900" type="submit">Autorizar</button>
      </Form>

    </PrincipalLayout >
  );
}


export default AuthenticationPage;