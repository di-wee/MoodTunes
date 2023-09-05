import { Box, Button, Container, Typography } from '@mui/material';
import { blue, indigo } from '@mui/material/colors';
import React from 'react';
import { Icon } from '@iconify/react';
import { Spotify } from 'mdi-material-ui';
import { LoginOutlined } from '@mui/icons-material';
const Login = () => {
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
						width: '30%',
						borderRadius: '15%',
						opacity: '75%',
						position: 'relative',
						top: '10.5rem',
						left: '35%',
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
						sx={{ color: blue[50], marginBottom: '3rem' }}>
						Welcome Back
					</Typography>
					<Button
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
