import { useState } from 'react';

const useSpotifyPlayer = (uri) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const getJWT = localStorage.getItem('jwtToken');

	const playSong = async (uri) => {
		setIsLoading(true);
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/play/',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${getJWT}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ uri: uri }),
				}
			);

			if (response.ok) {
				console.log('Song successfully played');
			} else {
				console.log('Error playing song');
			}
		} catch (err) {
			setError(err);
			console.log('Error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const pauseSong = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/pause/',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${getJWT}`,
					},
				}
			);

			if (response.ok) {
				console.log('Song successfully paused');
			} else {
				console.log('Error pausing song');
			}
		} catch (err) {
			setError(err);
			console.log('Error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const nextSong = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/next/',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${getJWT}`,
					},
				}
			);

			if (response.ok) {
				console.log('Successfully moved to the next song');
			} else {
				console.log('Error moving to the next song');
			}
		} catch (err) {
			setError(err);
			console.log('Error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const prevSong = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/previous/',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${getJWT}`,
					},
				}
			);

			if (response.ok) {
				console.log('Successfully moved to the previous song');
			} else {
				console.log('Error moving to the previous song');
			}
		} catch (err) {
			setError(err);
			console.log('Error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return { playSong, pauseSong, nextSong, prevSong, isLoading, error };
};

export default useSpotifyPlayer;
