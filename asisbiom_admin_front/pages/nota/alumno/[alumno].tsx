import { MainLayoutFixedHeight, Overline, Title } from "@/components";
import { useApi } from "@/hooks/useApi";
import Alumno from "@/interface/Alumno";
import { Close, InfoOutlined } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";

interface Nota {
  asunto: string,
  contenido: string,
  vencimiento: number,
  nivel_alerta: number,
}

export function NuevaNota({ id }: { id: number }) {
  const [isVencimientoEnabled, setVencimientoEnabled] = useState(false);
  const [showChip, setShowChip] = useState(false);
  const [alumno, setAlumno] = useState<Alumno>();
  const router = useRouter();

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    const item = localStorage.getItem("enable-note-info-chip");
    if (item == "on") setShowChip(true);
    useApi<Alumno>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/alumno/${id}` }).then(res => setAlumno(res.data))
  }, []);

  function submitevent(data: any) {

    console.log(data)

    useApi<Nota>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/nota/${id}`, method: "POST", body: {
        asunto: data.asunto,
        contenido: data.contenido,
        nivel_alerta: data.nivel_alerta,
        vencimiento: data.vencimiento
      }
    }).then(res => {
      router.replace(`/nota/msg?success=true&alumno=${alumno!.nombreCompleto}`);
    }).catch(err => {
      router.replace(`/nota/msg?success=false&alumno=${alumno!.nombreCompleto}`);
    });

  }

  function deleteChip() {
    localStorage.setItem("enable-note-info-chip", "off");
    setShowChip(false);
  }

  if (alumno)
    return (
      <MainLayoutFixedHeight title="Escribir nota">
        <Title>Escribir una nota</Title>
        <Overline>Aparecerá en la pantalla de {alumno.nombreCompleto}</Overline>
        <Form
          onSubmit={
            handleSubmit(submitevent) as unknown as FormSubmitHandler<FieldValues>
          }
          control={control}
          className="px-4 flex flex-col xl:w-1/2 md:w-3/4 w-full gap-4"
        >
          <TextField
            {...register("asunto", { required: true })}
            placeholder="Asunto" error={errors.asunto != undefined}></TextField>
          {errors.asunto && <Typography color={"red"} fontSize={15}>Este campo es necesario</Typography>}
          <TextField
            {...register("contenido", { required: true })}
            multiline rows={4} placeholder="Contenido" error={errors.contenido != undefined}></TextField>
          {errors.contenido && <Typography color={"red"} fontSize={15}>Este campo es necesario</Typography>}
          <FormControl fullWidth>
            <InputLabel id="nivel_alerta-select-label">
              Nivel de alerta
            </InputLabel>
            <Select
              {...register("nivel_alerta", { required: true })}
              label="Nivel de Alerta"
              labelId="nivel_alerta-select-label"
              defaultValue={0}
            >
              <MenuItem value={0}>Predeterminado</MenuItem>
              <MenuItem value={1}>Baja</MenuItem>
              <MenuItem value={2}>Media</MenuItem>
              <MenuItem value={3}>Alta</MenuItem>
            </Select>
          </FormControl>{" "}
          {showChip && (
            <Chip
              label="El nivel de alerta le indica al alumno la gravedad o urgencia del
          asunto que trata el mensaje."
              variant="filled"
              color="warning"
              sx={{
                height: "auto",
                "& .MuiChip-label": {
                  display: "block",
                  whiteSpace: "normal",
                  padding: ".9em",
                },
              }}
              icon={<InfoOutlined />}
              deleteIcon={<Close />}
              onDelete={() => deleteChip()}
              className="text-[15px]"
            ></Chip>
          )}
          {/* Vencimiento */}
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => setVencimientoEnabled(e.target.checked)}
                checked={isVencimientoEnabled}
              />
            }
            className="select-none"
            label="Vencimiento de la nota"
          />
          <FormControl disabled={!isVencimientoEnabled} fullWidth>
            <InputLabel id="vencimiento-select-label">Vencimiento</InputLabel>
            <Select
              {...register("vencimiento", { required: false })}
              label="Vencimiento"
              labelId="vencimiento-select-label"
            >
              <MenuItem disabled>Despues de</MenuItem>
              <MenuItem value={0}>Nunca</MenuItem>
              <MenuItem value={1}>Un Día</MenuItem>
              <MenuItem value={3}>Tres Días</MenuItem>
              <MenuItem value={7}>Una Semana</MenuItem>
              <MenuItem value={30}>Un Mes</MenuItem>
              <MenuItem value={92}>Un Trimestre</MenuItem>
              <MenuItem value={184}>Dos Trimestres</MenuItem>
              <MenuItem value={365}>Tres Trimestres</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" type="submit">Enviar</Button>
        </Form>
      </MainLayoutFixedHeight>
    );
  else return <MainLayoutFixedHeight title="No encontado">
    <Overline>No encontramos al alumno con id {id}</Overline>
  </MainLayoutFixedHeight>

}

NuevaNota.getInitialProps = async ({ query }: any) => {
  const { alumno: id } = query;
  return { id };
};


export default NuevaNota;
