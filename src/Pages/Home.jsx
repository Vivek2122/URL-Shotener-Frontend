import React, { useState } from "react";
import { Copy, QrCode, Zap, BarChart2, Shield } from "lucide-react";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";

const Hero = () => {
	const [urlInput, setUrlInput] = useState("");
	const [shortUrl, setShortUrl] = useState("");
	const [isCopied, setIsCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleShorten = async () => {
		if (!urlInput || urlInput.trim() === "") return;
		setIsLoading(true);
		setError("");
		try {
			const { data } = await axios.post(
				"https://url-shortener-api-rj6k.onrender.com/url/shorten",
				{
					originalUrl: urlInput,
				}
			);
			setShortUrl(
				`https://url-shortener-api-rj6k.onrender.com/url/${data.shortUrl}`
			);
		} catch (err) {
			console.log(err);
			setError(err.response?.data?.err || "Something went wrong!");
		}
		setIsLoading(false);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(shortUrl);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<section className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 md:px-20 py-20">
			{/* Hero Text */}
			<motion.div
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center mb-12 max-w-2xl"
			>
				<h1 className="text-5xl font-bold text-gray-800 mb-4">
					Shorten. Share. Track.
				</h1>
				<p className="text-lg text-gray-600">
					Create short links, generate QR codes, and monitor clicks
					effortlessly.
				</p>
			</motion.div>

			{/* Non-logged-in prompt */}
			<p className="text-gray-500 text-sm mb-2">
				Want to track your links?{" "}
				<Link to="/signup" className="text-indigo-600 underline">
					Sign up for free
				</Link>
			</p>

			{/* Quick URL Shortener */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex flex-col md:flex-row gap-4 items-center w-full max-w-2xl"
			>
				<input
					type="text"
					placeholder="Paste your long URL..."
					value={urlInput}
					onChange={(e) => setUrlInput(e.target.value)}
					className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				/>
				<button
					onClick={handleShorten}
					disabled={isLoading}
					className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition disabled:opacity-50"
				>
					{isLoading ? "Shortening..." : "Shorten"}
				</button>
			</motion.div>

			{/* Error Message */}
			{error && <p className="text-red-600 mt-2">{error}</p>}

			{/* Short URL + QR Code */}
			<AnimatePresence>
				{shortUrl && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="mt-6 flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-xl shadow"
					>
						<div className="flex flex-col md:flex-row items-center gap-4">
							<div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
								<span className="text-indigo-600 font-semibold">
									{shortUrl}
								</span>
								<button
									onClick={handleCopy}
									className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 hover:cursor-pointer transition"
								>
									<Copy size={16} />
								</button>
							</div>
							{isCopied && (
								<span className="text-green-600 font-medium text-sm">
									Copied!
								</span>
							)}
						</div>
						<div className="bg-gray-50 p-2 rounded-lg shadow-sm">
							<QRCode value={shortUrl} size={128} />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Features */}
			<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
				{[
					{
						title: "Fast Shortening",
						desc: "Instantly shorten any link.",
						icon: <Zap size={32} className="mx-auto mb-2 text-indigo-600" />,
					},
					{
						title: "Detailed Analytics",
						desc: "Track visits & QR scans.",
						icon: (
							<BarChart2 size={32} className="mx-auto mb-2 text-indigo-600" />
						),
					},
					{
						title: "Secure & Free",
						desc: "No signup required for basic usage.",
						icon: <Shield size={32} className="mx-auto mb-2 text-indigo-600" />,
					},
				].map((feature, index) => (
					<motion.div
						key={feature.title}
						whileHover={{ scale: 1.05 }}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
					>
						{feature.icon}
						<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
						<p className="text-gray-600">{feature.desc}</p>
					</motion.div>
				))}
			</div>
		</section>
	);
};

export default Hero;
