import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext';
import {
	Button,
	AppBar,
	Toolbar,
	CardMedia,
	Typography,
	Grid,
	IconButton,
} from '@mui/material';
import { indigo } from '@mui/material/colors';
import { FastForward, FastRewind, PlayArrow } from '@mui/icons-material';
import { PauseBox, PlayBox } from 'mdi-material-ui';

function SpotifyPlayer(props) {
	const userCtx = useContext(UserContext);
	const { setDeviceId, isPaused, setPaused } = userCtx;
	const [player, setPlayer] = useState(undefined);
	const [token, setToken] = useState('');
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);
	const [currentTrack, setTrack] = useState({
		name: '',
		album: {
			images: [{ url: '' }],
		},
		artists: [{ name: '' }],
	});

	const { pauseSong, playSong, nextSong, previousSong } = props;

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
			// Token is not available yet, so exit early
			return;
		}

		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			console.log(token);
			const player = new window.Spotify.Player({
				name: 'MoodPlayer',
				getOAuthToken: (cb) => {
					cb(token);
				},
				volume: 0.5,
			});

			setPlayer(player);

			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				setDeviceId(device_id);
			});

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			player.addListener('player_state_changed', (state) => {
				if (!state) {
					return;
				}
				setTrack(state.track_window.current_track);
				setPaused(state.paused);
			});

			player.connect();
		};
	}, [token]);

	useEffect(() => {
		fetchToken();
	}, []);

	return (
		<AppBar
			position='absolute'
			sx={{
				right: '10px',
				top: '10px',
				backgroundColor: indigo[300],
				width: '300px', // Match this width in the Toolbar or its children as needed
			}}>
			<Toolbar
				sx={{
					justifyContent: 'center',
					paddingLeft: '5%',
					paddingRight: '5%',
					width: '100%', // Take up all available space within the AppBar
				}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between', // Adjust this to put the content into positions you'd prefer
						width: '100%', // Take up all available space within the Toolbar
					}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<CardMedia
							component='img'
							sx={{
								maxHeight: '4rem',
								maxWidth: '4rem',
								marginRight: '1rem',
								padding: '0.5rem',
							}}
							image={currentTrack.album.images[0].url}
						/>
						<div>
							<Typography variant='subtitle1'>{currentTrack.name}</Typography>
							<Typography variant='body2'>
								{currentTrack.artists[0].name}
							</Typography>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}>
						<IconButton
							style={{ marginRight: '-8px' }}
							variant='contained'
							color='secondary'
							onClick={() => previousSong()}>
							<FastRewind />
						</IconButton>
						<IconButton
							style={{ margin: '0 -8px' }}
							variant='contained'
							color='secondary'
							onClick={() => (isPaused ? playSong() : pauseSong())}>
							{isPaused ? <PlayBox /> : <PauseBox />}
						</IconButton>
						<IconButton
							style={{ marginLeft: '-8px' }}
							variant='contained'
							color='secondary'
							onClick={() => nextSong()}>
							<FastForward />
						</IconButton>
					</div>
				</div>
			</Toolbar>
		</AppBar>
	);
}

export default SpotifyPlayer;
