"use client"

import { MapPin, Calendar, X } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import type React from "react"
import { use, useEffect, useState } from "react"
import { ICoordinator, IBookingFormData, Props } from "@/app/interface/interface"
import Swal from 'sweetalert2';

export default function CoordinatorPage({ params }: Props) {
	const { id } = use(params);
	const [data, setData] = useState<ICoordinator | null>(null);
	const [isBookingOpen, setIsBookingOpen] = useState(false)
	const [formData, setFormData] = useState<IBookingFormData>({
		name: "",
		email: "",
		weddingdate: "",
		guestscount: "",
	});


	useEffect(() => {
		const fetchData = async () => {
			const url = process.env.NEXT_PUBLIC_FETCH_COORDINATOR_URL;

			const res = await fetch(`${url as string}${await id}`, {
				cache: "no-store",
			});
			if (!res.ok) return notFound();
			const coordinator: ICoordinator = await res.json();
			setData(coordinator);
		};
		fetchData();
	}, []);

	if (!data) return <div>Loading...</div>;


	const handleInputChange = (field: keyof IBookingFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		const bookingUrl = process.env.NEXT_PUBLIC_CREATE_BOOKING;

		e.preventDefault();

		const { name, email, weddingdate, guestscount } = formData;

		if (!name || !email || !weddingdate || !guestscount) {
			Swal.fire({
				icon: 'error',
				title: 'Incomplete Form',
				text: 'Please fill out all the required fields before submitting.',
			});
			return;
		}

		try {
			const res = await fetch(bookingUrl as string, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					coordinatorId: id
				}),
			});

			if (res.status === 409) {
				const conflictData = await res.json();
				Swal.fire({
					icon: 'warning',
					title: 'Booking Conflict',
					text: conflictData.message || 'This coordinator is unavailable on the selected date.',
				});
				return;
			}

			if (!res.ok) {
				throw new Error("Failed to submit booking");
			}

			const data = await res.json();
			console.log("Booking submitted successfully", data);

			Swal.fire({
				icon: 'success',
				title: 'Booking Submitted',
				text: 'Your booking has been submitted successfully!',
				timer: 3000,
				showConfirmButton: false,
			});

			setIsBookingOpen(false);
			setFormData({
				name: "",
				email: "",
				weddingdate: "",
				guestscount: "",
			});

		} catch (error: unknown) {
			console.error("Error submitting booking:", error);

			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error instanceof Error ? error.message : 'Something went wrong!',
			});
		}
	};


	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			setIsBookingOpen(false)
		}
	}

	return (
		<div className="min-h-screen py-10 px-4 max-w-4xl mx-auto border border-blue-400 rounded-2xl bg-gray-500">
			<div className="border rounded-xl overflow-hidden shadow-lg bg-white">
				<div className="relative w-full h-80">
					<Image
						src={data.profilephoto || "/placeholder.svg?height=320&width=800"}
						alt={data.name}
						fill
						className="object-cover"
					/>
				</div>

				<div className="p-6 space-y-6">
					{/* Header Section */}
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
								<div className="flex items-center text-gray-600 mt-2">
									<MapPin className="w-4 h-4 mr-1" />
									<span className="text-blue-500">{data.location}</span>
								</div>
							</div>
							<div className="text-right">
								<span className="text-2xl font-bold text-blue-600">${data.price.toLocaleString()}</span>
								<p className="text-sm text-gray-600">per event</p>
							</div>
						</div>
					</div>

					{/* Bio Section */}
					<div className="space-y-3">
						<h2 className="text-xl font-semibold text-gray-900">About</h2>
						<div className="prose prose-sm max-w-none">
							<p className="text-gray-600 leading-relaxed whitespace-pre-line">{data.bio}</p>
						</div>
					</div>

					{/* Availability Section */}
					<div className="space-y-3">
						<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<Calendar className="w-5 h-5" />
							Available Dates
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
							{data.availability.map((date, index) => (
								<div
									key={index}
									className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm text-center font-medium"
								>
									{date}
								</div>
							))}
						</div>
						{data.availability.length === 0 && (
							<p className="text-gray-500 italic">No available dates at the moment</p>
						)}
					</div>

					{/* Book Now Button */}
					<div className="pt-4 border-t border-gray-200">
						<button
							onClick={() => setIsBookingOpen(true)}
							className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
						>
							Book Now
						</button>
					</div>
				</div>
			</div>

			{/* Modal Overlay */}
			{isBookingOpen && (
				<div
					className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50"
					onClick={handleOverlayClick}
				>
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<div>
								<h3 className="text-lg font-semibold text-gray-900">Book {data.name}</h3>
								<p className="text-sm text-gray-600 mt-1">
									Fill out the form below to request a booking.
								</p>
							</div>
							<button
								onClick={() => setIsBookingOpen(false)}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Modal Content */}
						<form onSubmit={handleSubmit} className="p-6 space-y-4">
							<div className="space-y-2">
								<label htmlFor="name" className="block text-sm font-medium text-gray-700">
									Full Name *
								</label>
								<input
									id="name"
									type="text"
									placeholder="Enter your full name"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									required
									className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">
									Email Address *
								</label>
								<input
									id="email"
									type="email"
									placeholder="Enter your email address"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									required
									className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700">
									Wedding Date *
								</label>
								<input
									id="weddingDate"
									type="date"
									value={formData.weddingdate}
									onChange={(e) => handleInputChange("weddingdate", e.target.value)}
									required
									className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="guestNumber" className="block text-sm font-medium text-gray-700">
									Number of Guests *
								</label>
								<select
									id="guestNumber"
									value={formData.guestscount}
									onChange={(e) => handleInputChange("guestscount", e.target.value)}
									required
									className="w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="">Select guest count</option>
									<option value="1-50">1-50 guests</option>
									<option value="51-100">51-100 guests</option>
									<option value="101-150">101-150 guests</option>
									<option value="151-200">151-200 guests</option>
									<option value="201-300">201-300 guests</option>
									<option value="300+">300+ guests</option>
								</select>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => setIsBookingOpen(false)}
									className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
								>
									Send Request
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
