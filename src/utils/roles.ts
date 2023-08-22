export const roles = [
	{
		name: "Solo lectura",
		level: 0,
		roles: ["read_workers", "read_customers", "read_plans", "read_events"],
		dependencies: [],
	},
	{
		name: "Personal",
		level: 1,
		roles: ["read_workers", "handle_workers"],
		dependencies: ["read_plans", "read_events"],
	},
	{
		name: "Clientes",
		level: 2,
		roles: ["read_customers", "handle_customers"],
		dependencies: ["read_plans", "read_events"],
	},
	{
		name: "Crear eventos",
		level: 3,
		roles: ["read_events", "create_events"],
		dependencies: ["read_workers", "read_customers", "read_plans"],
	},
	{
		name: "Gestionar eventos",
		level: 4,
		roles: ["read_events", "handle_events"],
		dependencies: ["read_workers", "read_customers", "read_plans"],
	},
	{
		name: "Programador",
		level: 5,
		roles: ["read_plans", "handle_plans", "handle_shifts", "handle_events"],
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
