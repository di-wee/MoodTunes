import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { Spotify } from 'mdi-material-ui';
import UserContext from '../context/UserContext';
import { blue, teal } from '@mui/material/colors';

const Login = () => {
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
		window.location.href =
			import.meta.env.VITE_SERVER + '/accounts/spotify/login';
	};

	return (
		<div
			style={{
				height: '100vh',
				backgroundImage: "url('/pastel_bg.png')",
				backgroundSize: 'cover',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative',
			}}>
			<Container maxWidth='xs'>
				<Box
					sx={{
						bgcolor: blue[300],
						height: '49vh',
						width: '90%',
						borderRadius: '10%',
						opacity: '90%',
						position: 'relative',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Typography
						sx={{
							color: '#457B9D',
							marginBottom: '2rem',
							backgroundColor: blue[50],
							borderRadius: '8%',
							padding: '1rem',
							width: '60%',
							textAlign: 'center',
						}}
						variant='h5'>
						LOG IN
					</Typography>
					<Typography
						variant='h5'
						sx={{ color: '#1D3557', marginBottom: '2rem' }}>
						Welcome Back!
					</Typography>
					<TextField
						onChange={handleUserChange}
						required
						id='filled-required'
						label='Required'
						placeholder='Spotify Username'
						variant='filled'
						sx={{
							marginBottom: '1rem',
							width: '60%',
							backgroundColor: 'rgba(255, 255, 255, 0.8)',
						}}
					/>
					<Button
						onClick={LoginWithSpotify}
						endIcon={<Spotify></Spotify>}
						variant='contained'
						sx={{
							textTransform: 'none',
							width: '60%',
							height: '20%',
							marginTop: '0rem',
							backgroundColor: teal[400],
						}}>
						Log in with Spotify
					</Button>
				</Box>
			</Container>
		</div>
	);
};

export default Login;
