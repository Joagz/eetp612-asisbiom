import { MainLayoutFixedHeight, Title } from "@/components";
import { useApi } from "@/hooks";
import { Download, Refresh } from "@mui/icons-material";
import { Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Planilla {
	id: number,
	mes: number,
	fileNameFull: string,
	fileName: string,
	curso: any,
	fecha: string
};

const d = new Date();
let month = d.getMonth();

export function PlanillaPorCurso({ curso }: { curso: number }) {
	const [planillas, setPlanillas] = useState([] as Planilla[]);
	const { reload } = useRouter();

	useEffect(() => {
		useApi<Planilla[]>({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/planilla/curso/${curso}` }).then(
			res => setPlanillas(res.data)
		);
	}, [])

	function submitevent() {
		useApi({ url: `/api/planilla/generar/${curso}`, method: "POST" }).then(res => {
			reload();
		});
	}

	return (
		<MainLayoutFixedHeight title={"Planillas del curso"}>
			<Title>Planillas</Title>
			<form id="generator" onSubmit={() => submitevent()} method="post">
				<Button type="submit" startIcon={<Refresh />}>Actualizar Listado</Button>
			</form>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Fecha</TableCell>
						<TableCell>Mes</TableCell>
						<TableCell>Descarga</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{planillas.map((planilla) => (
						<TableRow>
							<TableCell>{planilla.fecha}</TableCell>
							<TableCell>{planilla.mes}</TableCell>
							<TableCell>
								<IconButton href={`/api/planilla/descarga/${planilla.id}`}><Download /></IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</MainLayoutFixedHeight>
	);

}

PlanillaPorCurso.getInitialProps = async ({ query }: any) => {
	const { curso } = query;
	return { curso };
};

export default PlanillaPorCurso;

