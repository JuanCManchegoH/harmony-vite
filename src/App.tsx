import { Toaster } from "sonner";
import { Route } from "wouter";
import Harmony from "./pages/Harmony";
import Login from "./pages/Login";

function App() {
	return (
		<>
			<Toaster richColors position="bottom-center" />
			<div className="h-full">
				<Route path="/login" component={Login} />
				<Route path="/harmony" component={Harmony} />
			</div>
		</>
	);
}

export default App;
