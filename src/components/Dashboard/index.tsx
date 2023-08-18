import { Card, Grid, Metric, Text } from "@tremor/react";
import { useEffect } from "react";
import { useAppSelector } from "../../hooks/store";
import { useUsers } from "../../hooks/useUsers";
import Fields from "./Fields";
import Users from "./Users";

export default function Dashboard() {
	const { users } = useAppSelector((state) => state.users);
	const { profile } = useAppSelector((state) => state.auth);
	const { getUsers } = useUsers(profile, users);

	useEffect(() => {
		profile.company.id && getUsers();
	}, [profile]);

	return (
		<Grid
			numItems={1}
			numItemsSm={2}
			numItemsLg={3}
			className="gap-2 h-full p-2"
		>
			<Users />
			<Fields />
			<Card>
				<Text>Cargos</Text>
				<Metric>KPI 3</Metric>
			</Card>
			<Card>
				<Text>Convenciones</Text>
				<Metric>KPI 4</Metric>
			</Card>
			<Card>
				<Text>Secuencias</Text>
				<Metric>KPI 5</Metric>
			</Card>
			<Card>
				<Text>Etiquetas</Text>
				<Metric>KPI 5</Metric>
			</Card>
		</Grid>
	);
}
