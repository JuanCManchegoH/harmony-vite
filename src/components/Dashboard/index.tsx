import { Grid } from "@tremor/react";
import { useEffect } from "react";
import { useAppSelector } from "../../hooks/store";
import { useUsers } from "../../hooks/useUsers";
import Conventions from "./Conventions";
import Fields from "./Fields";
import Positions from "./Positions";
import Sequences from "./Sequences";
import Tags from "./Tags";
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
			className="gap-2 h-full p-2 lg:grid-rows-3"
		>
			<Users />
			<Fields />
			<Positions />
			<Conventions />
			<Sequences />
			<Tags />
		</Grid>
	);
}
