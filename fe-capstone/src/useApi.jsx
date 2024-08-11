import { useState, useEffect } from 'react';
import { fetchAPI, submitAPI } from './api/api';

export function useApi() {
	const [api, setApi] = useState({
		fetchAPI: () => [],
		submitAPI: false,
	});

	// Mock the API sync for local dev convenience
	useEffect(() => {
		setApi({
			fetchAPI: async (date) => {
				return fetchAPI(date);
			},
			submitAPI: async () => {
				return submitAPI;
			},
		});
	}, []);

	return api;
}
