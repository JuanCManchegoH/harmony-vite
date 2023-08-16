import { Route } from "wouter";
import Login from "./pages/Login";

function App() {
	return (
		<div>
			{/* Login */}
			<Route path="/login" component={Login} />
		</div>
	);
}

export default App;
