import { UserCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Badge, Button, TableCell, TableRow } from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import CenteredModal from "../../../common/CenteredModal";
import { useAppSelector } from "../../../hooks/store";
import { useHandleUser, useUsers } from "../../../hooks/useUsers";
import { UsersWithId } from "../../../services/users/types";
import { getRolName, validateRoles } from "../../../utils/roles";
import HandleUser from "./HandleUser";

export default function User({ user }: { user: UsersWithId }) {
	const [openUpdate, setOpenUpdate] = useState(false);
	const { users } = useAppSelector((state) => state.users);
	const { profile } = useAppSelector((state) => state.auth);
	const { updateUser, deleteUser } = useUsers(profile, users);
	const { data, setData, handleUpdateUser } = useHandleUser(user);

	return (
		<TableRow className="border-b">
			{validateRoles(profile.roles, ["admin"], []) && (
				<TableCell className="pl-0 py-2 w-4">
					<XMarkIcon
						className="w-5 h-5 cursor-pointer hover:text-red-500"
						onClick={() =>
							toast("Confirmar acción", {
								action: {
									label: "Eliminar",
									onClick: () => deleteUser(user.id),
								},
							})
						}
					/>
				</TableCell>
			)}
			<TableCell className="py-2">
				<div
					className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500"
					title={user.userName}
				>
					<span className="leading-none text-white font-pacifico">
						{user.userName[0]}
					</span>
				</div>
				<span className="ml-2">{user.userName}</span>
			</TableCell>
			<TableCell className="hidden py-2 lg:table-cell">{user.email}</TableCell>
			<TableCell className="hidden py-2 lg:table-cell">
				<Badge size="sm" color="sky">
					{getRolName(user.roles)}
				</Badge>
			</TableCell>
			{validateRoles(profile.roles, ["admin"], []) && (
				<TableCell className="flex justify-end pr-0 py-2">
					<Button
						variant="secondary"
						color="sky"
						onClick={() => setOpenUpdate(true)}
						size="xs"
					>
						Editar
					</Button>
				</TableCell>
			)}
			<CenteredModal
				open={openUpdate}
				setOpen={setOpenUpdate}
				icon={UserCircleIcon}
				title={user.userName}
				action={() => handleUpdateUser(updateUser, user.id)}
				btnText="Actualizar"
			>
				<HandleUser
					user={user}
					data={data}
					setData={setData}
					profile={profile}
				/>
			</CenteredModal>
		</TableRow>
	);
}
