import {
	Delete,
	PauseCircle,
	PlayCircle,
	StopCircle,
} from '@mui/icons-material';
import {
	Box,
	Button,
	CardMedia,
	IconButton,
	Pagination,
	Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import { deepPurple, indigo, lightBlue } from '@mui/material/colors';
import SpotifyPlayer from './SpotifyPlayer';

const Tracks = (props) => {
	const { playlist } = props;
	const [songs, setSongs] = useState([]);
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);
	const userCtx = useContext(UserContext);
	const { deviceId, isPaused } = userCtx;
	const [localIsPaused, setLocalIsPaused] = useState({});
	const [songId, setSongId] = useState('');
	const [isPlaylistPaused, setisPlaylistPaused] = useState(null);

	// pagination logic
	const [page, setPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(songs.length / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = page * itemsPerPage;

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const handlePlaylistClick = async () => {
		try {
			if (isPaused === null || isPaused) {
				await playSongFromPlaylist(playlist.spotify_uri);
				setisPlaylistPaused(false);

				// after playing entire playlist, all songs should be in "playing" state.
				// to sync the loading state
				const newPausedState = {};
				songs.forEach((song) => (newPausedState[song.id] = false));
				setLocalIsPaused(newPausedState);
			} else {
				await pauseSong();
				setisPlaylistPaused(true);

				// if the entire playlist is paused, all songs should be in "paused" state.
				const newPausedState = {};
				songs.forEach((song) => (newPausedState[song.id] = true));
				setLocalIsPaused(newPausedState);
			}
		} catch (error) {
			console.error('Error:', error);
		}
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

				//adding song.id key and pause state value to an empty object
				//and then setting it to state so eg. { song.id: true} as default
				const initialPauseState = {};
				data.forEach((song) => {
					initialPauseState[song.id] = true;
				});
				setLocalIsPaused(initialPauseState);
			} else {
				console.log('error getting songs from playlist');
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	const playSong = async (uri) => {
		try {
			const res = await fetch(
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

			if (!res.ok) {
				const errorInfo = await res.json();
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
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/pause/',
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
				const errorInfo = await res.json();
				throw new Error(`Failed to pause playback: ${errorInfo.message}`);
			}

			console.log('Playback has been paused.');
		} catch (error) {
			console.error('Error in pausePlayback:', error);
		}
	};

	const nextSong = async (songId) => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/next_track/',
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
				const errorInfo = await res.json();
				throw new Error(`Failed to get next track: ${errorInfo.message}`);
			} else {
				// updating localIsPaused to indicate the next song that should be playing

				const nextSongId = songId;

				setLocalIsPaused((prevState) => ({
					...prevState,
					[nextSongId]: false,
				}));

				console.log('Next track');
			}
		} catch (error) {
			console.error('Error geting next track:', error);
		}
	};

	const previousSong = async (songId) => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/previous_track/',
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
				const errorInfo = await res.json();
				throw new Error(`Failed to get previous track: ${errorInfo.message}`);
			} else {
				// updating localIsPaused to indicate the next song that should be playing

				const nextSongId = songId;

				setLocalIsPaused((prevState) => ({
					...prevState,
					[nextSongId]: false,
				}));
				console.log('Previous track');
			}
		} catch (error) {
			console.error('Error geting previous track:', error);
		}
	};

	const deleteSongFromPlaylist = async (songId) => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + `/playlists/${playlist.id}/delete_song/`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${getJWT}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						song_id: songId,
					}),
				}
			);

			if (!res.ok) {
				const errorInfo = await response.json();
				throw new Error(`Failed to delete track: ${errorInfo.message}`);
			} else {
				console.log('Track deleted from playlist');
				getSongsFromPlaylist();
			}
		} catch (error) {
			console.error('Error deleting song from playlist:', error);
		}
	};

	const setPauseState = (songId) => {
		setLocalIsPaused((prevState) => ({
			...prevState,
			[songId]: !prevState[songId],
		}));
	};

	const onClickButton = (songId, songUri) => {
		if (localIsPaused[songId]) {
			playSong(songUri);
		} else {
			pauseSong();
		}

		setPauseState(songId);
		setSongId(songId);
	};

	useEffect(() => {
		getSongsFromPlaylist();
	}, [playlist.id]);

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

						width: '30%',
						alignItems: 'center',
						justifyContent: 'center',
						height: '4rem',
						backgroundColor: lightBlue[50],
						borderRadius: '30px',
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
						isPlaylistPaused || isPlaylistPaused == null ? (
							<PlayCircle />
						) : (
							<StopCircle />
						)
					}
					onClick={handlePlaylistClick}
					variant='contained'
					sx={{
						display: 'relative',
						backgroundColor: indigo[300],
						minWidth: '10rem',
						padding: '5px 10px',
						marginTop: '1rem',
					}}>
					{isPlaylistPaused || isPlaylistPaused == null
						? 'Play Playlist'
						: 'Stop Playlist'}
				</Button>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flexWrap: 'nowrap',
						minWidth: 600,
						width: '80%',
						marginTop: '1rem',
						padding: '1rem',
						backgroundColor: deepPurple[200],
						borderRadius: '8px',
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
											<Typography>Song: {song.name}</Typography>
											<Typography>Artist: {song.artist}</Typography>
										</Box>
									</Box>

									<Box>
										<IconButton
											style={{ margin: '0 -8px' }}
											variant='contained'
											color='primary'
											onClick={() => {
												onClickButton(song.id, song.uri);
											}}>
											{localIsPaused[song.id] ? (
												<PlayCircle />
											) : (
												<PauseCircle />
											)}
										</IconButton>
										<IconButton
											color='primary'
											onClick={() => deleteSongFromPlaylist(song.id)}>
											<Delete></Delete>
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
				previousSong={previousSong}
				songId={songId}></SpotifyPlayer>
		</div>
	);
};

export default Tracks;
