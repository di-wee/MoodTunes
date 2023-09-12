import { PauseCircle, PlayCircle, StopCircle } from '@mui/icons-material';
import { Box, Button, IconButton, Pagination, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import { indigo, lightBlue } from '@mui/material/colors';
import SpotifyPlayer from './SpotifyPlayer';

const Tracks = (props) => {
	const { playlist } = props;
	const [songs, setSongs] = useState([]);
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);
	const userCtx = useContext(UserContext);
	const { deviceId, isPaused } = userCtx;

	// pagination logic
	const [page, setPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(songs.length / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = page * itemsPerPage;

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const getSongsFromPlaylist = async () => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + `/playlists/${playlist.id}/get_songs/`,
				{
					headers: {
						Authorization: `Bearer ${getJWT}`,
						'Content-Type': 'application/json',
					},
				}
			);

			const data = await res.json();

			if (res.ok) {
				setSongs(data);
			} else {
				console.log('error getting songs from playlist');
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	const playSong = async (uri) => {
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
						uri: uri,
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

	const playSongFromPlaylist = async (playlist) => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/play_playlist/',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${getJWT}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						playlist_uri: playlist,
						device_id: deviceId,
					}),
				}
			);

			if (!res.ok) {
				const errorInfo = await res.json();
				throw new Error(`Failed to play song: ${errorInfo.message}`);
			}
		} catch (error) {
			console.error('Error in playing from playlist:', error);
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

	const nextSong = async () => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/next_track/', // Update the URL according to your backend route
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

			if (!res.ok) {
				const errorInfo = await response.json();
				throw new Error(`Failed to get next track: ${errorInfo.message}`);
			}

			console.log('Next track');
		} catch (error) {
			console.error('Error geting next track:', error);
		}
	};

	const previousSong = async () => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/previous_track/', // Update the URL according to your backend route
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

			if (!res.ok) {
				const errorInfo = await response.json();
				throw new Error(`Failed to get previous track: ${errorInfo.message}`);
			}

			console.log('Previous track');
		} catch (error) {
			console.error('Error geting previous track:', error);
		}
	};

	useEffect(() => {
		getSongsFromPlaylist();
	}, []);

	return (
		<div>
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
						{playlist.name}
					</Typography>
				</Box>
				<Button
					startIcon={
						isPaused || isPaused === null ? <PlayCircle /> : <StopCircle />
					}
					onClick={() => {
						if (isPaused === null || isPaused) {
							playSongFromPlaylist(playlist.spotify_uri);
						} else {
							pauseSong();
						}
					}}
					variant='contained'
					sx={{
						display: 'relative',
						backgroundColor: indigo[300],
						minWidth: '10rem',
						padding: '5px 10px',
						marginTop: '1rem',
					}}>
					{isPaused || isPaused === null ? 'Play Playlist' : 'Stop Playlist'}
				</Button>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flexWrap: 'nowrap',
						minWidth: 600,
						width: '90%',
						marginTop: '1rem',
						padding: '1rem',
						backgroundColor: lightBlue[100],
					}}>
					{songs.length > 0 ? (
						<>
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
										<Button onClick={() => console.log(isPaused)}>
											Test Me
										</Button>
									</Box>

									<Box>
										<IconButton
											style={{ margin: '0 -8px' }}
											variant='contained'
											color='primary'
											onClick={() => {
												if (isPaused === null || isPaused) {
													playSong(song.uri);
												} else {
													pauseSong();
												}
											}}>
											{isPaused || isPaused === null ? (
												<PlayCircle />
											) : (
												<PauseCircle />
											)}
										</IconButton>
									</Box>
								</div>
							))}
						</>
					) : (
						<>
							<Typography>No songs available</Typography>
						</>
					)}
				</Box>
				<Pagination
					sx={{ marginTop: '2rem' }}
					color='primary'
					count={totalPages}
					page={page}
					onChange={handlePageChange}></Pagination>
			</Box>
			<SpotifyPlayer
				pauseSong={pauseSong}
				playSong={playSong}
				nextSong={nextSong}
				previousSong={previousSong}></SpotifyPlayer>
		</div>
	);
};

export default Tracks;
