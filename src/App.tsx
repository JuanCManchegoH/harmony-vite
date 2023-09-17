import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Tracing from "./pages/Tracing";

function App() {
	return (
		<>
			<Toaster richColors closeButton position="bottom-center" />
			<div className="h-full">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/calendario" element={<Calendar />} />
					{/* <Route path="/estadisticas" element={<Tracing />} /> */}
				</Routes>
			</div>
		</>
	);
}

export default App;
