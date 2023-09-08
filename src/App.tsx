import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Plans from "./pages/Plans";

function App() {
	return (
		<>
			<Toaster richColors closeButton position="bottom-center" />
			<div className="h-full">
				<HashRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/programaciones" element={<Plans />} />
						{/* <Route path="/seguimiento" element={<Tracing />} /> */}
					</Routes>
				</HashRouter>
			</div>
		</>
	);
}

export default App;
