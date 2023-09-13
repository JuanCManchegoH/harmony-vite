import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Plans from "./pages/Plans";
import Tracing from "./pages/Tracing";

function App() {
	return (
		<>
			<Toaster richColors closeButton position="bottom-center" />
			<div className="h-full">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/programaciones" element={<Plans />} />
					<Route path="/seguimiento" element={<Tracing />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
