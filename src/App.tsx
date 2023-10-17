import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Harmony from "./pages/Harmony";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Calendar from "./pages/Calendar";
// import Statistics from "./pages/Statistics";

function App() {
	return (
		<>
			<Toaster
				richColors
				closeButton
				position="bottom-center"
				className="z-50"
				duration={2000}
			/>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/harmony" element={<Harmony />} />
				{/* <Route path="/calendario" element={<Calendar />} /> */}
				{/* <Route path="/estadisticas" element={<Statistics />} /> */}
			</Routes>
		</>
	);
}

export default App;
