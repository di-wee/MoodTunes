import React from 'react';
import Login from '../components/Login';
import {
	AppBar,
	Box,
	Button,
	ThemeProvider,
	Toolbar,
	Typography,
	createTheme,
} from '@mui/material';
import '@fontsource/roboto-condensed';
import { Link } from 'react-router-dom';
import { LoginOutlined } from '@mui/icons-material';

const spotifyGreen = '#1DB954';
const spotifyGrey = '#B3B3B3';
const navbarColor = '#333'; // Slightly lighter than Spotify's black for contrast

const theme = createTheme({
	palette: {
		primary: {
			main: navbarColor,
		},
		secondary: {
			main: spotifyGreen,
		},
	},
	typography: {
		fontFamily: 'Roboto Condensed',
	},
});

const Main = () => {
	return (
		<div>
			<ThemeProvider theme={theme}>
				<header>
					<AppBar
						position='static'
						color='primary'>
						<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
							{/* This empty Box will serve as a spacer */}
							<Box flex={1}></Box>

							{/* Centered "MOOD TUNES" */}
							<Box
								flex={2}
								textAlign='center'>
								<Typography variant='h6'>
									<Link
										to='/'
										style={{ textDecoration: 'none', color: spotifyGreen }}>
										MOOD TUNES
									</Link>
								</Typography>
							</Box>

							{/* Right-aligned "admin login" button */}
							<Box
								flex={1}
								display='flex'
								justifyContent='flex-end'>
								<Button
									variant='text'
									startIcon={<LoginOutlined />}
									sx={{ color: spotifyGrey }}>
									<Typography variant='button'>
										<a
											href='https://moodtunes.onrender.com/admin'
											style={{ textDecoration: 'none', color: spotifyGrey }}>
											admin login
										</a>
									</Typography>
								</Button>
							</Box>
						</Toolbar>
					</AppBar>
				</header>
			</ThemeProvider>
			<Login />
		</div>
	);
};

export default Main;
