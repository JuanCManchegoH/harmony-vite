import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Statistics from "./pages/Statistics";

function App() {
	return (
		<>
			<Toaster
				richColors
				closeButton
				position="bottom-center"
				className="z-50"
			/>
			<div className="h-full">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/calendario" element={<Calendar />} />
					<Route path="/estadisticas" element={<Statistics />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
