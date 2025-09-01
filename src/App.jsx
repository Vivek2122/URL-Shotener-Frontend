import React from "react";
import Home from "./Pages/Home.jsx";
import Signup from "./Pages/Signup.jsx";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Dashboard.jsx";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/login" element={<Login />} />
			<Route path="/dashboard" element={<Dashboard />} />
		</Routes>
	);
}

export default App;
