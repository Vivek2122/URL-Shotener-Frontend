import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCopy, FiCheck } from "react-icons/fi";

const Dashboard = () => {
	const [user, setUser] = useState(null);
	const [urls, setUrls] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newUrl, setNewUrl] = useState("");
	const [shortening, setShortening] = useState(false);
	const [copiedUrl, setCopiedUrl] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(
					"https://url-shortener-api-rj6k.onrender.com/url/dashboard",
					{
						withCredentials: true,
					}
				);
				setUser(res.data.user);
				setUrls(res.data.urls);
			} catch (err) {
				console.log("error in dashboard", err);
				toast.error("Failed to fetch dashboard data");
				navigate("/login");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [navigate]);

	const handleLogout = async () => {
		try {
			await axios.post(
				"https://url-shortener-api-rj6k.onrender.com/api/logout",
				{},
				{ withCredentials: true }
			);
			toast.success("Logged out successfully!");
			navigate("/login");
		} catch (err) {
			console.log(err.response?.data || err.message);
			toast.error("Logout failed");
		}
	};

	const handleShorten = async () => {
		if (!newUrl.trim()) return;
		setShortening(true);
		try {
			const { data } = await axios.post(
				"https://url-shortener-api-rj6k.onrender.com/url/shorten/auth",
				{ originalUrl: newUrl },
				{ withCredentials: true }
			);
			setUrls((prev) => [
				{
					_id: Date.now(),
					originalUrl: newUrl,
					shortUrl: data.shortUrl,
					clicks: data.clicks || 0,
					qrCode: data.qrCode,
				},
				...prev,
			]);
			toast.success("URL shortened!");
			setNewUrl("");
		} catch (err) {
			toast.error(err.response?.data?.err || "Failed to shorten URL");
		} finally {
			setShortening(false);
		}
	};

	const handleCopy = (shortUrl) => {
		navigator.clipboard.writeText(shortUrl);
		setCopiedUrl(shortUrl);
		toast.success("Copied to clipboard!");
		setTimeout(() => setCopiedUrl(""), 1500);
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				Loading dashboard...
			</div>
		);

	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="relative p-8 max-w-6xl mx-auto space-y-10 min-h-screen bg-slate-50"
		>
			{/* Top highlight strip */}
			<div className="absolute top-0 left-0 w-full h-32 bg-indigo-100 rounded-b-4xl z-0"></div>

			{/* Header */}
			<div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
				<h1 className="text-3xl font-bold text-gray-800">
					Welcome, {user?.name}
				</h1>
				<button
					onClick={handleLogout}
					className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 hover:shadow-lg hover:scale-[1.03] hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200"
				>
					Logout
				</button>
			</div>

			{/* URL Shortener */}
			<div className="relative z-10 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow">
				<input
					type="text"
					value={newUrl}
					onChange={(e) => setNewUrl(e.target.value)}
					placeholder="Paste your URL..."
					className="flex-1 px-4 py-3 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            transition-all duration-200"
				/>
				<button
					onClick={handleShorten}
					disabled={shortening}
					className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md
            hover:bg-indigo-700 hover:shadow-lg hover:scale-[1.03] hover:cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            transition-all duration-200"
				>
					{shortening ? "Shortening..." : "Shorten"}
				</button>
			</div>

			{/* URLs */}
			<div className="relative z-10">
				<h2 className="text-2xl font-semibold text-gray-800 flex items-center">
					Your URLs
					<span className="ml-3 w-12 h-1 bg-indigo-500 rounded-full"></span>
				</h2>
			</div>

			{urls.length === 0 ? (
				<div className="relative z-10 text-center text-gray-600">
					<svg
						className="mx-auto mb-4"
						width="64"
						height="64"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
					>
						<path d="M4 12h16M4 6h16M4 18h7" />
					</svg>
					<p>No URLs yet. Start shortening now!</p>
				</div>
			) : (
				<div className="relative z-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<AnimatePresence>
						{urls.map((u, idx) => {
							const bgColor =
								idx % 3 === 0
									? "bg-indigo-50 hover:shadow-indigo-100"
									: idx % 3 === 1
									? "bg-purple-50 hover:shadow-purple-100"
									: "bg-slate-100 hover:shadow-slate-200";

							return (
								<motion.div
									key={u._id}
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									whileHover={{
										scale: 1.03,
									}}
									className={`p-5 rounded-xl shadow border border-gray-200 transition-all duration-200 flex flex-col justify-between ${bgColor}`}
								>
									<div className="flex-1 break-words space-y-2">
										<p className="text-gray-700 font-medium">{u.originalUrl}</p>
										<div className="flex items-center justify-between gap-2">
											<a
												href={u.shortUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="text-indigo-600 font-semibold hover:underline"
											>
												{u.shortUrl}
											</a>
											<button
												onClick={() => handleCopy(u.shortUrl)}
												className="p-1 rounded hover:bg-gray-200 transition hover:cursor-pointer"
											>
												{copiedUrl === u.shortUrl ? (
													<FiCheck size={18} className="text-green-600" />
												) : (
													<FiCopy size={18} />
												)}
											</button>
										</div>
									</div>

									<div className="flex items-center justify-between mt-4">
										{u.qrCode && (
											<img
												src={u.qrCode}
												alt="QR"
												className="w-20 h-20 rounded-lg shadow hover:scale-105 transition"
											/>
										)}
										<div className="flex flex-col items-center">
											<p className="text-gray-500 text-xs mb-1">Clicks</p>
											<span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow">
												{u.clicks}
											</span>
										</div>
									</div>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>
			)}
		</motion.section>
	);
};

export default Dashboard;
