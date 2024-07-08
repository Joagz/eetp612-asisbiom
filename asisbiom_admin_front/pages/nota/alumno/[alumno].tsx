import { MainLayoutFixedHeight, Overline, Title } from "@/components";
import { useApi } from "@/hooks/useApi";
import Alumno from "@/interface/Alumno";
import ListAlumnosCurso from "@/interface/ListAlumnosCurso";
import { Close, InfoOutlined } from "@mui/icons-material";
import {
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import { FieldValues, Form, FormSubmitHandler, useForm } from "react-hook-form";

export function NuevaNota({ id }: { id: number }) {
  const [isVencimientoEnabled, setVencimientoEnabled] = useState(true);
  const [showChip, setShowChip] = useState(false);
  const [alumno, setAlumno] = useState<Alumno>();

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

  function submitevent(data: any) { }

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
          <TextField placeholder="Asunto"></TextField>
          <TextField multiline rows={4} placeholder="Contenido"></TextField>
          <FormControl fullWidth>
            <InputLabel id="nivel-alerta-select-label">
              Nivel de alerta
            </InputLabel>
            <Select
              {...register("nivel-alerta", { required: true })}
              label="Nivel de Alerta"
              labelId="nivel-alerta-select-label"
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
              {...register("vencimiento", { required: true })}
              label="Vencimiento"
              labelId="vencimiento-select-label"
              defaultValue={1}
            >
              <MenuItem disabled>Despues de</MenuItem>
              <MenuItem value={1}>Un Día</MenuItem>
              <MenuItem value={3}>Tres Días</MenuItem>
              <MenuItem value={7}>Una Semana</MenuItem>
              <MenuItem value={30}>Un Mes</MenuItem>
              <MenuItem value={92}>Un Trimestre</MenuItem>
              <MenuItem value={184}>Dos Trimestres</MenuItem>
              <MenuItem value={365}>Tres Trimestres</MenuItem>
            </Select>
          </FormControl>
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
