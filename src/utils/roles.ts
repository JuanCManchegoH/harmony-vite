export const roles = [
	{
		name: "Solo lectura",
		level: 0,
		roles: ["read_workers", "read_customers", "read_stalls", "read_shifts"],
		dependencies: [],
	},
	{
		name: "Personal",
		level: 1,
		roles: ["read_workers", "handle_workers"],
		dependencies: ["read_stalls", "read_customers", "read_shifts"],
	},
	{
		name: "Clientes",
		level: 2,
		roles: ["read_customers", "handle_customers"],
		dependencies: ["read_stalls", "read_workers", "read_shifts"],
	},
	{
		name: "Crear eventos",
		level: 3,
		roles: ["create_shifts"],
		dependencies: [
			"read_workers",
			"read_customers",
			"read_stalls",
			"read_shifts",
		],
	},
	{
		name: "Gestionar eventos",
		level: 4,
		roles: ["handle_shifts"],
		dependencies: [
			"read_workers",
			"read_customers",
			"read_stalls",
			"read_shifts",
		],
	},
	{
		name: "Programador",
		level: 5,
		roles: ["read_stalls", "handle_stalls", "handle_shifts"],
		dependencies: ["read_customers", "read_customers"],
	},
	{
		name: "Admin",
		level: 6,
		roles: ["admin"],
		dependencies: [],
	},
	{
		name: "SuperAdmin",
		level: 7,
		roles: ["super_admin"],
		dependencies: [],
	},
];

export const validateRoles = (
	userRoles: string[],
	requiredRoles: string[],
	allowedRoles: string[],
) => {
	if (userRoles.includes("super_admin")) return true;
	const hasRequiredRoles = requiredRoles.every((role) =>
		userRoles.includes(role),
	);
	const hasAllowedRoles = allowedRoles.some((role) => userRoles.includes(role));
	if (requiredRoles.length > 0) return hasRequiredRoles;
	return hasAllowedRoles;
};

export const getRolName = (userRoles: string[]) => {
	const matchedRoles = roles
		.filter((r) => r.roles.every((role) => userRoles.includes(role)))
		.sort((a, b) => b.level - a.level);

	return matchedRoles[0]?.name || "Sin rol";
};
