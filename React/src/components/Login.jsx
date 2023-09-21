import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Spotify } from 'mdi-material-ui';
import UserContext from '../context/UserContext';
import { CircularProgress } from '@mui/material';

const spotifyGreen = '#1DB954';
const spotifyBlack = '#121212';
const spotifyGrey = '#B3B3B3';

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);
	const UserCtx = useContext(UserContext);
	const { storeUsername, setStoreUsername } = UserCtx;

	const handleUserChange = (event) => {
		setStoreUsername(event.target.value);
	};

	useEffect(() => {
		localStorage.setItem('username', storeUsername);
	}, [storeUsername]);

	const LoginWithSpotify = () => {
		if (!storeUsername) {
			return alert('Please enter your Spotify username.');
		}
		setIsLoading(true);
		window.location.href =
			import.meta.env.VITE_SERVER + '/accounts/spotify/login';
	};

	return (
		<Box
			sx={{
				height: '100vh',
				backgroundColor: spotifyBlack,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<Spotify style={{ color: spotifyGreen, width: 60, height: 60 }} />
			<Typography
				variant='h4'
				sx={{ color: '#FFF', marginBottom: '1rem', marginTop: '1rem' }}>
				Welcome Back!
			</Typography>
			<Container maxWidth='xs'>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 2, // Spacing between child elements
					}}>
					<TextField
						onChange={handleUserChange}
						required
						id='filled-required'
						label='Spotify Username'
						placeholder='Enter Spotify Username'
						variant='filled'
						fullWidth
						sx={{
							'& .MuiFilledInput-root': {
								backgroundColor: 'rgba(50, 50, 50, 0.7)',
							},
							'& .MuiInputLabel-root': {
								color: spotifyGrey,
							},
							'& .MuiFilledInput-input::placeholder': {
								color: 'rgba(255, 255, 255, 0.5)',
							},
							'& .MuiFilledInput-input:focus::placeholder': {
								color: 'rgba(255, 255, 255, 0.7)',
							},
							'& .MuiFilledInput-input': {
								color: '#FFF',
							},
						}}
					/>
					{isLoading ? (
						<CircularProgress sx={{ color: '#1ED760' }} />
					) : (
						<Button
							onClick={LoginWithSpotify}
							endIcon={<Spotify />}
							variant='contained'
							fullWidth
							sx={{
								textTransform: 'none',
								backgroundColor: spotifyGreen,
								'&:hover': {
									backgroundColor: spotifyGreen,
								},
							}}>
							Log in with Spotify
						</Button>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default Login;
