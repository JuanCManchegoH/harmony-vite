import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Harmony from "./pages/Harmony";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
	return (
		<>
			<Toaster richColors closeButton position="bottom-center" />
			<div className="h-full">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/harmony" element={<Harmony />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
