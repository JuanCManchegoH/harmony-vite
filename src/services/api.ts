const API = `${import.meta.env.VITE_API_URL}`;

const api = {
	auth: {
		login: `${API}/users/login`,
		profile: `${API}/users/profile`,
	},
	company: {
		// customerFields
		createCustomerField: `${API}/cfields`,
		updateCustomerField: (cfieldId: string) => `${API}/cfields/${cfieldId}`,
		deleteCustomerField: (cfieldId: string) => `${API}/cfields/${cfieldId}`,
		// workerFields
		createWorkerField: `${API}/wfields`,
		updateWorkerField: (wfieldId: string) => `${API}/wfields/${wfieldId}`,
		deleteWorkerField: (wfieldId: string) => `${API}/wfields/${wfieldId}`,
		// positions
		createPosition: `${API}/positions`,
		updatePosition: (positionId: string) => `${API}/positions/${positionId}`,
		deletePosition: (positionId: string) => `${API}/positions/${positionId}`,
		// conventions
		createConvention: `${API}/conventions`,
		updateConvention: (conventionId: string) =>
			`${API}/conventions/${conventionId}`,
		deleteConvention: (conventionId: string) =>
			`${API}/conventions/${conventionId}`,
		// sequences
		createSequence: `${API}/sequences`,
		updateSequence: (sequenceId: string) => `${API}/sequences/${sequenceId}`,
		deleteSequence: (sequenceId: string) => `${API}/sequences/${sequenceId}`,
		//tags
		createTag: `${API}/tags`,
		updateTag: (tagId: string) => `${API}/tags/${tagId}`,
		deleteTag: (tagId: string) => `${API}/tags/${tagId}`,
	},
	users: {
		create: `${API}/users`,
		getByCompany: (companyId: string) => `${API}/users/company/${companyId}`,
		update: (userId: string) => `${API}/users/${userId}`,
		updateRoles: (userId: string) => `${API}/users/roles/${userId}`,
		updateCustomers: (userId: string) => `${API}/users/customers/${userId}`,
		updateWorkers: (userId: string) => `${API}/users/workers/${userId}`,
		delete: (userId: string) => `${API}/users/${userId}`,
	},
	customers: {
		create: `${API}/customers`,
		createAndUpdate: `${API}/customers/createAndUpdate`,
		getByCompany: `${API}/customers/`,
		update: (customerId: string) => `${API}/customers/${customerId}`,
		delete: (customerId: string) => `${API}/customers/${customerId}`,
	},
	workers: {
		create: `${API}/workers`,
		createAndUpdate: `${API}/workers/createAndUpdate`,
		search: (search: string, limit: number, offset: number) =>
			`${API}/workers/${search}/${limit}/${offset}`,
		getByIds: `${API}/workers/array`,
		update: (workerId: string) => `${API}/workers/${workerId}`,
		delete: (workerId: string) => `${API}/workers/${workerId}`,
	},
	stalls: {
		create: `${API}/stalls`,
		getByCustomer: `${API}/stalls/getByCustomer`,
		getByMonthsAndYears: `${API}/stalls/getByMonthsAndYears`,
		update: (stallId: string) => `${API}/stalls/${stallId}`,
		delete: (stallId: string) => `${API}/stalls/${stallId}`,
		// stall workers
		addWorker: (stallId: string) => `${API}/stalls/addWorker/${stallId}`,
		updateWorker: (stallId: string, workerId: string) =>
			`${API}/stalls/updateWorker/${stallId}/${workerId}`,
		removeWorker: (stallId: string, workerId: string) =>
			`${API}/stalls/removeWorker/${stallId}/${workerId}`,
	},
	shifts: {
		createMany: `${API}/shifts`,
		updateMany: `${API}/shifts`,
		getByMonthsAndYears: `${API}/shifts/getByMonthsAndYears`,
		deleteMany: (stallId: string) => `${API}/shifts/delete/${stallId}`,
	},
	logs: {
		getByMonthAndYear: (month: string, year: string) =>
			`${API}/logs/${month}/${year}`,
	},
};

export default api;
