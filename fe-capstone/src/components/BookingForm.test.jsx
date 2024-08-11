import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For the matchers
import BookingForm from './BookingForm';
import { useApi } from '../useApi';

// Mock the useApi hook
jest.mock('../useApi', () => ({
	useApi: () => ({
		fetchAPI: jest.fn(() => Promise.resolve(['17:00', '18:00', '19:00'])),
		submitAPI: jest.fn(() => Promise.resolve(true)),
	}),
}));

describe('BookingForm', () => {
	test('renders form fields correctly', () => {
		render(<BookingForm />);

		expect(screen.getByLabelText(/Choose date/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Choose time/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Number of guests/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Occasion/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Reserve/i })
		).toBeInTheDocument();
	});

	test('updates date field correctly', () => {
		render(<BookingForm />);
		const dateInput = screen.getByLabelText(/Choose date/i);

		fireEvent.change(dateInput, { target: { value: '2024-08-12' } });
		expect(dateInput.value).toBe('2024-08-12');
	});

	test('updates time field with available times', async () => {
		render(<BookingForm />);

		const dateInput = screen.getByLabelText(/Choose date/i);
		fireEvent.change(dateInput, { target: { value: '2024-08-12' } });

		// Wait for available times to be updated
		await waitFor(() => {
			expect(screen.getByText('17:00')).toBeInTheDocument();
			expect(screen.getByText('18:00')).toBeInTheDocument();
			expect(screen.getByText('19:00')).toBeInTheDocument();
		});
	});

	test('validates form fields and displays error messages', async () => {
		render(<BookingForm />);

		// Submit form without filling in required fields
		fireEvent.click(screen.getByRole('button', { name: /Reserve/i }));

		expect(await screen.findByText('Date is required')).toBeInTheDocument();
		expect(await screen.findByText('Time is required')).toBeInTheDocument();
		expect(
			await screen.findByText('Number of guests must be between 1 and 10')
		).toBeInTheDocument();
		expect(await screen.findByText('Occasion is required')).toBeInTheDocument();
	});

	test('submits the form correctly', async () => {
		render(<BookingForm />);

		fireEvent.change(screen.getByLabelText(/Choose date/i), {
			target: { value: '2024-08-12' },
		});
		fireEvent.change(screen.getByLabelText(/Choose time/i), {
			target: { value: '17:00' },
		});
		fireEvent.change(screen.getByLabelText(/Number of guests/i), {
			target: { value: '2' },
		});
		fireEvent.change(screen.getByLabelText(/Occasion/i), {
			target: { value: 'Birthday' },
		});

		fireEvent.click(screen.getByRole('button', { name: /Reserve/i }));

		await waitFor(() => {
			expect(screen.queryByText('Date is required')).not.toBeInTheDocument();
			expect(screen.queryByText('Time is required')).not.toBeInTheDocument();
			expect(
				screen.queryByText('Number of guests must be between 1 and 10')
			).not.toBeInTheDocument();
			expect(
				screen.queryByText('Occasion is required')
			).not.toBeInTheDocument();
		});
	});
});
