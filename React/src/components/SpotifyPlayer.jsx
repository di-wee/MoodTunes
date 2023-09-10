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

function WebPlayback(props) {
	const userCtx = useContext(UserContext);
	const { setDeviceId } = userCtx;
	const [player, setPlayer] = useState(undefined);
	const [currentTrack, setTrack] = useState({
		name: '',
		album: {
			images: [{ url: '' }],
		},
		artists: [{ name: '' }],
	});
	const [isPaused, setPaused] = useState(false);
	const { token, pauseSong, playSong } = props;

	useEffect(() => {
		if (!token) return;
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
	}, []);

	return (
		<AppBar
			position='fixed'
			sx={{
				top: 'auto',
				bottom: 0,
				zIndex: 9999,
				backgroundColor: indigo[300],
			}}>
			<Toolbar
				sx={{
					justifyContent: 'center',
					paddingLeft: '5%',
					paddingRight: '5%',
				}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flex: 1,
					}}>
					<CardMedia
						component='img'
						sx={{ maxHeight: '4rem', maxWidth: '4rem', marginRight: '1rem' }}
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
						marginRight: '50rem',
					}}>
					<IconButton
						variant='contained'
						color='secondary'
						onClick={() => player.previousTrack()}>
						<FastRewind></FastRewind>
					</IconButton>
					<IconButton
						variant='contained'
						color='secondary'
						onClick={() => (isPaused ? playSong() : pauseSong())}>
						{isPaused ? <PlayBox></PlayBox> : <PauseBox></PauseBox>}
					</IconButton>
					<IconButton
						variant='contained'
						color='secondary'
						onClick={() => player.nextTrack()}>
						<FastForward></FastForward>
					</IconButton>
				</div>
			</Toolbar>
		</AppBar>
	);
}

export default WebPlayback;
