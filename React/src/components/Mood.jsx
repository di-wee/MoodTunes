import React, { useContext, useEffect, useState } from 'react';
import {
	Box,
	Card,
	CardMedia,
	IconButton,
	Pagination,
	Typography,
} from '@mui/material';

import { AddCircle, PauseCircle, PlayCircle } from '@mui/icons-material';

import SpotifyPlayerComponent from './SpotifyPlayer';
import UserContext from '../context/UserContext';
import AddToPlaylistModal from './AddToPlaylistModal';
import { grey } from '@mui/material/colors';
import { darken } from '@mui/material/styles';

const spotifyGreen = '#1DB954';
const spotifyGrey = '#191414'; // this is the dark blackish-grey background color commonly used by Spotify
const spotifyText = '#FFFFFF';
const spotifySubtitle = '#B3B3B3';

const Mood = (props) => {
	const [songs, setSongs] = useState([]);
	const { mood } = props;
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);
	const userCtx = useContext(UserContext);
	const { deviceId, setSongId, isPaused } = userCtx;
	const [showModal, setShowModal] = useState(false);

	// pagination logic
	const [page, setPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(songs.length / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = page * itemsPerPage;
	const [token, setToken] = useState('');
	const [localIsPaused, setLocalIsPaused] = useState({});

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

				//adding song.id key and pause state value to an empty object
				//and then setting it to state so eg. { song.id: true} as default
				const initialPauseState = {};
				data.forEach((song) => {
					initialPauseState[song.id] = true;
				});
				setLocalIsPaused(initialPauseState);
			} else {
				console.log('error getting songs');
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	//so when clicked, {song.id : true} turns tinto {song.id: false}
	const setPauseState = (songId) => {
		setLocalIsPaused((prevState) => ({
			...prevState,
			[songId]: !prevState[songId],
		}));
	};

	useEffect(() => {}, [isPaused]);

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
				backgroundColor: spotifyGrey,
				padding: '2rem 10%',
				minHeight: '100vh',
			}}>
			<Typography
				variant='h4'
				textAlign={'center'}
				sx={{ color: spotifyGreen, marginBottom: '2rem' }}>
				{mood.title} Songs
			</Typography>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				{songs.slice(startIndex, endIndex).map((song, index) => (
					<Card
						key={index}
						sx={{
							display: 'flex',
							alignItems: 'center',
							padding: '1rem',
							backgroundColor: grey[800],
							borderRadius: '10px',
							transition: 'transform 0.2s',
							'&:hover': {
								transform: 'scale(1.02)',
								boxShadow: '2px 4px 15px rgba(0, 0, 0, 0.2)',
							},
						}}>
						<CardMedia
							component='img'
							sx={{
								height: '60px',
								width: '60px',
								borderRadius: '50%',
								marginRight: '1rem',
							}}
							image={song.album_art}
						/>
						<Box sx={{ flexGrow: 1 }}>
							<Typography style={{ color: spotifyText }}>
								{song.name}
							</Typography>
							<Typography
								variant='body2'
								style={{ color: spotifySubtitle }}>
								{song.artist}
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', gap: '0.5rem' }}>
							<IconButton
								sx={{ color: spotifyGreen }}
								onClick={() => {
									if (localIsPaused[song.id]) {
										playSong(song.uri);
									} else {
										pauseSong();
									}
									setPauseState(song.id);
								}}>
								{localIsPaused[song.id] ? <PlayCircle /> : <PauseCircle />}
							</IconButton>
							<IconButton
								sx={{ color: spotifyGreen }}
								onClick={() => handleAddToPlaylistClick(song.id)}>
								<AddCircle />
							</IconButton>
						</Box>
					</Card>
				))}
			</Box>

			<Pagination
				sx={{
					marginTop: '2rem',
					display: 'flex',
					justifyContent: 'center',
					'& button': {
						backgroundColor: spotifyGreen,
						color: spotifyText,
					},
					'& button:hover': {
						backgroundColor: darken(spotifyGreen, 0.1),
					},
				}}
				count={totalPages}
				page={page}
				onChange={handlePageChange}
			/>

			{token && (
				<SpotifyPlayerComponent
					playSong={playSong}
					pauseSong={pauseSong}
					token={token}
				/>
			)}
			{showModal && token && (
				<AddToPlaylistModal
					setShowModal={setShowModal}
					showModal={showModal}
				/>
			)}
		</div>
	);
};

export default Mood;
