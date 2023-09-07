import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { blue, indigo } from '@mui/material/colors';
import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import { Spotify } from 'mdi-material-ui';
import { LoginOutlined } from '@mui/icons-material';

const Login = () => {
	const {}



	const LoginWithSpotify = () => {
		window.location.href =
			import.meta.env.VITE_SERVER + '/accounts/spotify/login';
	};

	return (
		<div
			style={{
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative',
			}}>
			<Container maxWidth='xs'>
				<Box
					sx={{
						bgcolor: blue[100],
						height: '11vh',
						width: '40%',
						borderRadius: '8%',
						opacity: '85%',
						position: 'relative',
						left: '30%',
						zIndex: 1,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Typography
						sx={{ color: indigo[800] }}
						variant='h5'>
						LOG IN
					</Typography>
				</Box>
				<Box
					sx={{
						bgcolor: indigo[600],
						height: '35vh',
						width: '100%',
						borderRadius: '10%',
						opacity: '85%',
						position: 'relative',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Typography
						variant='h5'
						sx={{ color: blue[50], marginBottom: '1rem' }}>
						Welcome Back!
					</Typography>
					<TextField
						required
						id='filled-required'
						label='Required'
						defaultValue='Spotify Username'
						variant='filled'
						sx={{
							marginBottom: '1rem',
							width: '60%',
							backgroundColor: 'rgba(255, 255, 255, 0.5)', // 70% opaque white background
							'& .MuiFilledInput-root': {
								background: 'rgba(255, 255, 255, 0.7)',
							},
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
						}}>
						Log in with Spotify
					</Button>
					<Button
						href='https://www.spotify.com/sg-en/signup?flow_id=fba86dcd-96d7-4e4c-a61a-11087c9e62dc%3A1693990596&forward_url=https%3A%2F%2Faccounts.spotify.com%2Fauthorize%3Fscope%3Duser-read-playback-state%2Bstreaming%2Buser-modify-playback-state%26response_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A8000%252Faccounts%252Fspotify%252Flogin%252Fcallback%252F%26state%3DuZgSaYP920xjafpu%26client_id%3D9586b49be80f489bb5c32e5614822cd1%26flow_ctx%3Dfba86dcd-96d7-4e4c-a61a-11087c9e62dc%253A1693990596'
						endIcon={<LoginOutlined></LoginOutlined>}
						sx={{
							textTransform: 'none',
							width: '60%',
							color: blue[50],
							marginTop: '1rem',
						}}>
						Sign up with Spotify
					</Button>
				</Box>
			</Container>
		</div>
	);
};

export default Login;
