import {
	PencilSquareIcon,
	UserCircleIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { Badge } from "@tremor/react";
import { useState } from "react";
import { toast } from "sonner";
import Avatar from "../../../common/Avatar";
import CenteredModal from "../../../common/CenteredModal";
import { Dropdown, DropdownItem } from "../../../common/DropDown";
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

	const options = [
		{
			icon: PencilSquareIcon,
			name: "Editar",
			action: () => setOpenUpdate(true),
		},
		{
			icon: XMarkIcon,
			name: "Eliminar",
			action: () =>
				toast("Confirmar acción", {
					action: {
						label: "Eliminar",
						onClick: () => deleteUser(user.id),
					},
				}),
		},
	];

	return (
		<li className="flex justify-between p-2 px-4 bg-gray-50">
			<div className="flex items-center min-w-0 gap-x-4">
				<Avatar title={user.userName} letter={user.userName[0]} />
				<div className="min-w-0 flex-auto">
					<p className="text-sm font-semibold leading-6 text-gray-900">
						{user.userName}
					</p>
					<p className="flex text-xs leading-5 text-gray-500">{user.email}</p>
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-x-6">
				<div className="hidden sm:flex sm:flex-col sm:items-end">
					<Badge size="sm" color="sky" className="font-semibold">
						{getRolName(user.roles)}
					</Badge>
				</div>
				{validateRoles(profile.roles, ["admin"], []) && (
					<Dropdown btnText="Gestionar" position="right">
						{options

						.map((option) => (
							<DropdownItem
								key={option.name}
								icon={option.icon}
								onClick={option.action}
							>
								{option.name}
							</DropdownItem>
						))}
					</Dropdown>
				)}
			</div>
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
		</li>
	);
}
