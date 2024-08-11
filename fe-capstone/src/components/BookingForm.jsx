import React, { useEffect, useState } from 'react';
import { useApi } from '../useApi';

function BookingForm() {
	// Define state variables for each form field
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [guests, setGuests] = useState(1);
	const [occasion, setOccasion] = useState('');
	const [errors, setErrors] = useState({});
	const { fetchAPI, submitAPI } = useApi();

	// Initialize available times as state
	const [availableTimes, setAvailableTimes] = useState([]);

	useEffect(() => {
		async function fetchAvailableTimes() {
			if (date) {
				try {
					const response = await fetchAPI(new Date(date));
					setAvailableTimes(response);
				} catch (error) {
					console.error('Error fetching available times', error);
				}
			}
		}
		fetchAvailableTimes();
	}, [date, fetchAPI]);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {};

		if (!date) newErrors.date = 'Date is required';
		if (!time) newErrors.time = 'Time is required';
		if (guests < 1 || guests > 10)
			newErrors.guests = 'Number of guests must be between 1 and 10';
		if (!occasion) newErrors.occasion = 'Occasion is required';

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const formData = { date, time, guests, occasion };

		try {
			const success = await submitAPI(formData);
			if (success) {
				console.log('Form submitted:', formData);
				// Reset form on successful submission
				setDate('');
				setTime('');
				setGuests(1);
				setOccasion('');
			} else {
				console.error('Form submission failed');
			}
		} catch (error) {
			console.error('Error submitting form', error);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			style={{ display: 'grid', maxWidth: '100%', gap: '20px', margin: 'auto' }}
		>
			<label htmlFor="res-date">Choose date</label>
			<input
				type="date"
				id="res-date"
				value={date}
				onChange={(e) => setDate(e.target.value)}
				required
				aria-required="true"
			/>
			{errors.date && (
				<p role="alert" style={{ color: 'red' }}>
					{errors.date}
				</p>
			)}

			<label htmlFor="res-time">Choose time</label>
			<select
				id="res-time"
				value={time}
				onChange={(e) => setTime(e.target.value)}
				required
				aria-required="true"
			>
				<option value="">Select a time</option>
				{availableTimes.map((timeOption) => (
					<option key={timeOption} value={timeOption}>
						{timeOption}
					</option>
				))}
			</select>
			{errors.time && (
				<p role="alert" style={{ color: 'red' }}>
					{errors.time}
				</p>
			)}

			<label htmlFor="guests">Number of guests</label>
			<input
				type="number"
				id="guests"
				value={guests}
				onChange={(e) => setGuests(parseInt(e.target.value, 10))}
				min="1"
				max="10"
				required
				aria-required="true"
			/>
			{errors.guests && (
				<p role="alert" style={{ color: 'red' }}>
					{errors.guests}
				</p>
			)}

			<label htmlFor="occasion">Occasion</label>
			<select
				id="occasion"
				value={occasion}
				onChange={(e) => setOccasion(e.target.value)}
				aria-required="true"
			>
				<option value="">Select occasion</option>
				<option value="Birthday">Birthday</option>
				<option value="Anniversary">Anniversary</option>
			</select>
			{errors.occasion && (
				<p role="alert" style={{ color: 'red' }}>
					{errors.occasion}
				</p>
			)}

			<button type="submit">Reserve</button>
		</form>
	);
}

export default BookingForm;
