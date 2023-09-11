import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Pagination, Typography } from '@mui/material';

import { lightBlue } from '@mui/material/colors';
import {
	AddCircle,
	FastForward,
	FastRewind,
	PauseCircle,
	PlayCircle,
} from '@mui/icons-material';
import SpotifyPlayerComponent from './SpotifyPlayer';
import UserContext from '../context/UserContext';
import AddToPlaylistModal from './AddToPlaylistModal';

const Mood = (props) => {
	const [songs, setSongs] = useState([]);
	const { mood } = props;
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);
	const playerRef = useRef(null);
	const [player, setPlayer] = useState(null);
	const userCtx = useContext(UserContext);
	const { deviceId, setSongId } = userCtx;
	const [showModal, setShowModal] = useState(false);

	// pagination logic
	const [page, setPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(songs.length / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = page * itemsPerPage;
	const [token, setToken] = useState('');

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const handleAddToPlaylistClick = (songid) => {
		setShowModal(true);
		setSongId(songid);
	};

	const fetchToken = async () => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/spotify_token/',
				{
					headers: {
						Authorization: `Bearer ${getJWT}`,
						'Content-Type': 'application/json',
					},
				}
			);

			const data = await res.json();
			if (res.ok) {
				setToken(data.token);
			} else {
				console.error('Error retrieving Spotify token');
				return null;
			}
		} catch (error) {
			console.error('Fetch token error:', error);
			return null;
		}
	};

	const playSong = async (spotifyUri) => {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/play/',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${getJWT}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						uri: spotifyUri,
						device_id: deviceId,
					}),
				}
			);

			if (!response.ok) {
				const errorInfo = await response.json();
				throw new Error(`Failed to play song: ${errorInfo.message}`);
			}
		} catch (error) {
			console.error('Error in playSong:', error);
		}
	};

	const pauseSong = async () => {
		try {
			const response = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/pause/', // Update the URL according to your backend route
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${getJWT}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						device_id: deviceId,
					}),
				}
			);

			if (!response.ok) {
				const errorInfo = await response.json();
				throw new Error(`Failed to pause playback: ${errorInfo.message}`);
			}

			console.log('Playback has been paused.');
		} catch (error) {
			console.error('Error in pausePlayback:', error);
		}
	};

	const getSongsFromMood = async () => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/moods/get_songs/' + mood.title,
				{
					headers: {
						Authorization: `Bearer ${getJWT}`,
					},
				}
			);

			const data = await res.json();

			if (res.ok) {
				setSongs(data);
			} else {
				console.log('error getting songs');
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	useEffect(() => {
		getSongsFromMood();
		fetchToken();
	}, []);

	useEffect(() => {
		console.log(token);
	}, [token]);
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				height: '100vh',
			}}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '3rem',
					alignItems: 'center',
				}}>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						minWidth: '40%',
						width: '40%',
						alignItems: 'center',
						justifyContent: 'center',
						height: '4rem',
						backgroundColor: lightBlue[50],
						borderRadius: '5%',
					}}>
					<Typography
						variant='h6'
						textAlign={'center'}
						sx={{ color: lightBlue[900] }}>
						{mood.title} Songs:
					</Typography>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flexWrap: 'nowrap',
						minWidth: 600,
						width: '100%',
						marginTop: '1rem',
						padding: '1rem',
						backgroundColor: lightBlue[100],
					}}>
					{songs.slice(startIndex, endIndex).map((song, index) => (
						<div
							key={index}
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '10px',
								justifyContent: 'space-between',
							}}>
							<Box sx={{ marginRight: '1rem' }}>
								<Typography>Song: {song.name}</Typography>
								<Typography>Artist: {song.artist}</Typography>
							</Box>
							<Box>
								<PlayCircle
									sx={{ cursor: 'pointer' }}
									onClick={() => playSong(song.uri)}
									color='primary'></PlayCircle>
								<PauseCircle
									sx={{ cursor: 'pointer' }}
									onClick={() => pauseSong()}
									color='primary'></PauseCircle>
								<AddCircle
									sx={{ cursor: 'pointer' }}
									onClick={() => handleAddToPlaylistClick(song.id)}
									color='primary'></AddCircle>
							</Box>
						</div>
					))}
				</Box>
				<Pagination
					sx={{ marginTop: '2rem' }}
					color='primary'
					count={totalPages}
					page={page}
					onChange={handlePageChange}></Pagination>
			</Box>
			{token && (
				<SpotifyPlayerComponent
					playSong={playSong}
					pauseSong={pauseSong}
					token={token}></SpotifyPlayerComponent>
			)}
			{showModal && token && (
				<AddToPlaylistModal
					setShowModal={setShowModal}
					showModal={showModal}></AddToPlaylistModal>
			)}
		</div>
	);
};

export default Mood;
