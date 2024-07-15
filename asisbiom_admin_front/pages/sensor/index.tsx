import React from "react";
import { MainLayoutFixedHeight, Paragraph, Title } from "../../components";
import { useMemo, useState } from "react";
import { useApi } from "../../hooks"
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { DeleteForever, Edit, Person } from "@mui/icons-material";

interface User {
  id: number,
  email: string,
  phone: string,
  role: string,
  nombreCompleto: string,
  dni: string,

}

const homeDocentes = () => {
  const [usuarios, setDocentes] = useState<User[]>([]);


  useMemo(() => {
    useApi<User[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/user` })
      .then(res => {
        console.log(res.data);
        setDocentes(res.data.filter(k => k.role == "SENSOR"));
      })
  }, [])


  return (
    <MainLayoutFixedHeight title="Sensores">
      <Title>Sensores Registrados</Title>
      <Paragraph>Listado de dispositivos autorizados</Paragraph>
      <div className="flex flex-col gap-4 p-8 w-full">

        {usuarios.map(usuario => {
          if (usuario.nombreCompleto) return (
            <Card className="w-full p-2" key={usuario.id}>
              <CardContent>
              <Typography variant="h6">{usuario.email}</Typography>
              <Typography>{usuario.role}</Typography>
              </CardContent>
              <CardActions className="flex gap-4">
                <Button color="primary" startIcon={<Edit />}>Editar</Button>
                <Button color="warning" href={`/docentes/autorizar?correo=${usuario.email}&cargo=${usuario.role}`} startIcon={<Person />}>Cambiar cargo</Button>
                <Button color="error" startIcon={<DeleteForever />}>Borrar</Button>
              </CardActions>
            </Card>)
        }
        )}
      </div>
    </MainLayoutFixedHeight>
  );
}

export default homeDocentes;
