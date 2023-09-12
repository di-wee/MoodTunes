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
	CircularProgress,
} from '@mui/material';
import { indigo } from '@mui/material/colors';
import { FastForward, FastRewind, PlayArrow } from '@mui/icons-material';
import { PauseBox, PlayBox } from 'mdi-material-ui';
import Draggable from 'react-draggable';

function SpotifyPlayer(props) {
	const userCtx = useContext(UserContext);
	const { setDeviceId, isPaused, setPaused } = userCtx;

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
			const player = new window.Spotify.Player({
				name: 'MoodPlayer',

				//callback function to call the spotify access token
				getOAuthToken: (cb) => {
					cb(token);
				},
				volume: 0.5,
			});

			//event listeners for when the player is 'ready'
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
				if (
					state.track_window.current_track &&
					state.track_window.current_track.album
				) {
					setLoading(false);
				}
			});

			player.connect();
		};
	}, [token]);

	useEffect(() => {
		fetchToken();
	}, []);

	return (
		<Draggable>
			<AppBar
				position='absolute'
				sx={{
					right: '10px',
					top: '10px',
					backgroundColor: indigo[300],
					width: '300px',
					cursor: 'move',
				}}>
				<Toolbar
					sx={{
						justifyContent: 'center',
						paddingLeft: '5%',
						paddingRight: '5%',
						width: '100%',
					}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
						}}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							{isLoading ? (
								<CircularProgress sx={{ color: 'white' }} />
							) : (
								<>
									{currentTrack.album && currentTrack.album.images[0] && (
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
									)}
									<div>
										<Typography variant='subtitle1'>
											{currentTrack.name}
										</Typography>
										{currentTrack.artists[0] && (
											<Typography variant='body2'>
												{currentTrack.artists[0].name}
											</Typography>
										)}
									</div>
								</>
							)}
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
		</Draggable>
	);
}

export default SpotifyPlayer;
