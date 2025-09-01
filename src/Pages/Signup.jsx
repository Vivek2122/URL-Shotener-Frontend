import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true);

	const navigate = useNavigate();

	// Redirect if user is already logged in
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get(
					"https://url-shortener-api-rj6k.onrender.com/api/isAuthenticated",
					{ withCredentials: true }
				);
				if (res.data?.user) {
					navigate("/dashboard");
				}
			} finally {
				setCheckingAuth(false);
			}
		};
		checkAuth();
	}, [navigate]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError(""); // clear error as soon as user types
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await axios.post(
				"https://url-shortener-api-rj6k.onrender.com/api/signup",
				formData,
				{
					withCredentials: true,
				}
			);
			toast.success("Signup successful!");
			navigate("/login");
		} catch (err) {
			const msg = err.response?.data?.message || "Signup failed";
			setError(msg);
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignup = () => {
		window.location.href =
			"https://url-shortener-api-rj6k.onrender.com/api/auth/google";
	};

	if (checkingAuth) {
		return (
			<section className="w-full min-h-screen flex items-center justify-center">
				Checking authentication...
			</section>
		);
	}

	return (
		<section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8"
			>
				<h2 className="text-3xl font-bold text-gray-800 mb-2">
					Create Account
				</h2>
				<p className="text-gray-600 mb-6 text-sm">
					Sign up to start shortening and tracking your URLs.
				</p>

				{error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="name"
						placeholder="Full Name"
						value={formData.name}
						onChange={handleChange}
						className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
						required
					/>
					<input
						type="email"
						name="email"
						placeholder="Email Address"
						value={formData.email}
						onChange={handleChange}
						className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
						required
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={formData.password}
						onChange={handleChange}
						className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
						required
					/>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition shadow-sm"
					>
						{loading ? "Signing up..." : "Sign Up"}
					</button>
				</form>

				<div className="mt-5">
					<button
						onClick={handleGoogleSignup}
						className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-200 hover:cursor-pointer transition shadow-sm"
					>
						<FcGoogle size={18} />
						<span>Sign up with Google</span>
					</button>
				</div>

				<p className="mt-6 text-center text-gray-500 text-sm">
					Already have an account?{" "}
					<Link to="/login" className="text-indigo-600 hover:underline">
						Log in
					</Link>
				</p>
			</motion.div>
		</section>
	);
};

export default Signup;
