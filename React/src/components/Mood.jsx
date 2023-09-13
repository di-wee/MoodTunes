import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	Box,
	CardMedia,
	IconButton,
	Pagination,
	Typography,
} from '@mui/material';

import { blue, deepPurple, indigo, lightBlue } from '@mui/material/colors';
import { AddCircle, PauseCircle, PlayCircle } from '@mui/icons-material';
import SpotifyPlayerComponent from './SpotifyPlayer';
import UserContext from '../context/UserContext';
import AddToPlaylistModal from './AddToPlaylistModal';

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
				display: 'flex',
				justifyContent: 'center',
				height: '100%',
				backgroundColor: blue[50],
				borderRadius: '5%',
				margin: '2rem',
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
						backgroundColor: indigo[300],
						borderRadius: '5%',
					}}>
					<Typography
						variant='h6'
						textAlign={'center'}
						sx={{ color: blue[50] }}>
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
						backgroundColor: deepPurple[200],
						borderRadius: '8px',
					}}>
					{songs.slice(startIndex, endIndex).map((song, index) => (
						<div
							key={index}
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '10px',
								justifyContent: 'space-between',
								backgroundColor: deepPurple[100], // inner pastel background
								borderRadius: '8px', // Rounded corners
								padding: '8px', // padding
							}}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									marginRight: '1rem',
								}}>
								<CardMedia
									component='img'
									sx={{
										maxHeight: '4rem',
										maxWidth: '4rem',
										marginRight: '1rem',
										padding: '0.5rem',
									}}
									image={song.album_art}
								/>
								<Box sx={{ marginRight: '1rem' }}>
									<Typography style={{ color: '#3D405B' }}>
										Song: {song.name}
									</Typography>
									<Typography style={{ color: '#3D405B' }}>
										Artist: {song.artist}
									</Typography>
								</Box>
							</Box>
							<Box>
								<IconButton
									style={{ margin: '0 -8px' }}
									variant='contained'
									color='primary'
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
								<AddCircle
									sx={{ cursor: 'pointer' }}
									onClick={() => handleAddToPlaylistClick(song.id)}
									color='primary'></AddCircle>
							</Box>
						</div>
					))}
				</Box>
				<Pagination
					sx={{
						marginTop: '2rem',
						backgroundColor: indigo[200], // pastel yellow for pagination
						borderRadius: '8px', // Rounded corners
					}}
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
