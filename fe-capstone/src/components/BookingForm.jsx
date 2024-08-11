import React, { useEffect, useState } from 'react';
import { useApi } from '../useApi';

function BookingForm() {
	// Define state variables for each form field
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [guests, setGuests] = useState(1);
	const [occasion, setOccasion] = useState('');
	const { fetchAPI, submitAPI } = useApi();

	// Initialize available times as state (this could be fetched from an API later)
	const [availableTimes, setAvailableTimes] = useState([]);

	useEffect(() => {
		async function fetchAvailableTimes() {
			const response = await fetchAPI(new Date(date));
			setAvailableTimes(response);
		}
		if (date) {
			fetchAvailableTimes();
		}
	}, [date, fetchAPI]);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = {
			date,
			time,
			guests,
			occasion,
		};

		await submitAPI(formData);
		console.log('Form submitted:', formData);
		// You could send this data to an API here
	};

	return (
		<form
			onSubmit={handleSubmit}
			style={{ display: 'grid', maxWidth: '200px', gap: '20px' }}
		>
			<label htmlFor="res-date">Choose date</label>
			<input
				type="date"
				id="res-date"
				value={date}
				onChange={(e) => setDate(e.target.value)}
				required
			/>

			<label htmlFor="res-time">Choose time</label>
			<select
				id="res-time"
				value={time}
				onChange={(e) => setTime(e.target.value)}
				required
			>
				{availableTimes.map((timeOption) => (
					<option key={timeOption} value={timeOption}>
						{timeOption}
					</option>
				))}
			</select>

			<label htmlFor="guests">Number of guests</label>
			<input
				type="number"
				id="guests"
				value={guests}
				onChange={(e) => setGuests(e.target.value)}
				min="1"
				max="10"
				required
			/>

			<label htmlFor="occasion">Occasion</label>
			<select
				id="occasion"
				value={occasion}
				onChange={(e) => setOccasion(e.target.value)}
			>
				<option value="">Select occasion</option>
				<option value="Birthday">Birthday</option>
				<option value="Anniversary">Anniversary</option>
			</select>

			<button type="submit">Reserve</button>
		</form>
	);
}

export default BookingForm;
