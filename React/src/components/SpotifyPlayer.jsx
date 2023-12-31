import React, { useState, useEffect, useContext, useRef } from 'react';
import UserContext from '../context/UserContext';
import {
	AppBar,
	Toolbar,
	CardMedia,
	Typography,
	IconButton,
	CircularProgress,
	Box,
} from '@mui/material';
import { FastForward, FastRewind } from '@mui/icons-material';
import { PauseBox, PlayBox } from 'mdi-material-ui';
import Draggable from 'react-draggable';
import { grey } from '@mui/material/colors';

const SpotifyControls = ({
	isPaused,
	playSong,
	pauseSong,
	songId,
	previousSong,
	nextSong,
}) => (
	<Box sx={{ display: 'flex', alignItems: 'center' }}>
		<IconButton
			onClick={() => previousSong(songId)}
			sx={{ mr: -1 }}
			color='inherit'>
			<FastRewind />
		</IconButton>

		<IconButton
			onClick={() => (isPaused ? playSong() : pauseSong())}
			sx={{ mx: -1 }}
			color='inherit'>
			{isPaused ? <PlayBox /> : <PauseBox />}
		</IconButton>

		<IconButton
			onClick={() => nextSong(songId)}
			sx={{ ml: -1 }}
			color='inherit'>
			<FastForward />
		</IconButton>
	</Box>
);

const TrackInfo = ({ track }) => (
	<Box sx={{ display: 'flex', alignItems: 'center' }}>
		<CardMedia
			component='img'
			sx={{
				maxHeight: '3.5rem',
				maxWidth: '4rem',
				mr: 2,
			}}
			image={track.album?.images[0]?.url || 'defaultImageURL'}
		/>
		<Box>
			<Typography
				variant='subtitle1'
				color='inherit'>
				{track.name}
			</Typography>
			<Typography
				variant='body2'
				color='inherit'>
				{track.artists[0]?.name || 'Unknown'}
			</Typography>
		</Box>
	</Box>
);
function SpotifyPlayer(props) {
	const userCtx = useContext(UserContext);
	const { setDeviceId, isPaused, setPaused } = userCtx;
	const playerRef = useRef(null);

	const [token, setToken] = useState('');
	const [isLoading, setLoading] = useState(true);
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);

	const [currentTrack, setTrack] = useState({
		name: 'Unknown',
		album: {
			images: [{ url: 'defaultImageURL' }],
		},
		artists: [{ name: 'Unknown' }],
	});

	const {
		pauseSong,
		playSong,
		nextSong,
		previousSong,
		songId,
		isPlaylistPaused,
	} = props;

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

	useEffect(() => {
		if (!token) {
			return;
		}

		// getting player script from spotify; regular DOM
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;

		// appending it to html body
		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			//creating the spotify player thru a class
			playerRef.current = new window.Spotify.Player({
				name: 'MoodPlayer',

				//callback function to call the spotify access token
				getOAuthToken: (cb) => {
					cb(token);
				},
				volume: 0.5,
			});

			//event listeners for when the player is 'ready'
			playerRef.current.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				setDeviceId(device_id);
			});

			playerRef.current.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			playerRef.current.addListener('player_state_changed', (state) => {
				if (!state) {
					return;
				}
				setTrack(state.track_window.current_track);

				setPaused(state.paused);

				if (
					state.track_window.current_track &&
					state.track_window.current_track.album
				) {
					setLoading(false);
				}
			});

			playerRef.current.connect();
		};
	}, [token]);

	useEffect(() => {
		console.log('isPaused changed:', isPaused);
	}, [isPaused]);

	useEffect(() => {
		return () => {
			// clean up logic when user goes to another component or unmount; to disconnect player
			if (playerRef.current) {
				playerRef.current.disconnect();
			}
			setTrack({
				name: 'Unknown',
				album: {
					images: [{ url: 'defaultImageURL' }],
				},
				artists: [{ name: 'Unknown' }],
			});

			setPaused(true);
			setLoading(true);
		};
	}, []);

	useEffect(() => {
		fetchToken();
	}, []);

	return (
		<Draggable>
			<AppBar
				position='absolute'
				sx={{
					right: 10,
					top: 10,
					bgcolor: grey[900],
					width: '300px',
					cursor: 'move',
				}}>
				<Toolbar sx={{ justifyContent: 'space-between' }}>
					{isLoading ? (
						<CircularProgress sx={{ color: 'white' }} />
					) : (
						<TrackInfo track={currentTrack} />
					)}

					<SpotifyControls
						{...props}
						isPaused={isPaused}
					/>
				</Toolbar>
			</AppBar>
		</Draggable>
	);
}

export default SpotifyPlayer;
