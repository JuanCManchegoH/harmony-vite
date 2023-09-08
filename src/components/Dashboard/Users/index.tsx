import { UserCircleIcon } from "@heroicons/react/24/solid";
import CenteredModal from "../../../common/CenteredModal";
import { useAppSelector } from "../../../hooks/store";
import { useHandleUser, useUsers } from "../../../hooks/useUsers";
import { getRolName, validateRoles } from "../../../utils/roles";
import HandleUser from "./HandleUser";
import User from "./User";
// import Modal from "../../../common/RightModal";
import { Button, Title } from "@tremor/react";
import { Fragment, useState } from "react";
// import HandleUser from "./HandleUser";
// import User from "./User";

export default function Users() {
	const { profile } = useAppSelector((state) => state.auth);
	const { users } = useAppSelector((state) => state.users);
	const { createUser } = useUsers(profile, users);
	const { data, setData, handleCreateUser } = useHandleUser();
	const [openCreate, setOpenCreate] = useState(false);

	return (
		<>
			<div className="flex space-x-2 items-center justify-between border-b sticky top-0 p-2 px-4 bg-gray-50">
				<Title>Usuarios</Title>
				{validateRoles(profile.roles, ["admin"], []) && (
					<Button
						variant="primary"
						onClick={() => setOpenCreate(true)}
						color="sky"
						size="xs"
					>
						Crear Usuario
					</Button>
				)}
			</div>
			<ul className="divide-y divide-gray-200">
				{users.map((user) => {
					const superAdmin =
						getRolName(user.roles) === "SuperAdmin" ? true : false;
					return (
						<Fragment key={user.id}>
							{superAdmin && getRolName(profile.roles) === "SuperAdmin" && (
								<User user={user} />
							)}
							{!superAdmin && <User user={user} />}
						</Fragment>
					);
				})}
			</ul>
			<CenteredModal
				open={openCreate}
				setOpen={setOpenCreate}
				icon={UserCircleIcon}
				title="Crear usuario"
				btnText="Crear"
				action={() => handleCreateUser(createUser)}
			>
				<HandleUser data={data} setData={setData} profile={profile} />
			</CenteredModal>
		</>
	);
}
