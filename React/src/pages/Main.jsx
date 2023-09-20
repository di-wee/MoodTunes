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
import { blue, lightBlue } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { LoginOutlined } from '@mui/icons-material';

const theme = createTheme({
	palette: {
		primary: {
			main: blue[50],
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
					<Box
						sx={{
							flexGrow: 1,
							display: 'flex',
							alignContent: 'center',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<AppBar position='static'>
							<Toolbar
								sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<div style={{ flex: 1 }}></div>{' '}
								{/* Left Spacer to ensure balance */}
								<div style={{ flex: 2, textAlign: 'center' }}>
									<Typography
										variant='h6'
										component='div'
										sx={{ color: lightBlue[800] }}>
										<Link
											to='/'
											style={{ textDecoration: 'none', color: 'inherit' }}>
											MOOD TUNES
										</Link>
									</Typography>
								</div>
								<div
									style={{
										flex: 1,
										display: 'flex',
										justifyContent: 'flex-end',
									}}>
									<Button
										color='inherit'
										startIcon={<LoginOutlined />}>
										<Typography
											variant='h8'
											component='div'
											sx={{ color: lightBlue[800] }}>
											<a
												href='https://moodtunes.onrender.com/admin'
												style={{
													textDecoration: 'none',
													color: 'inherit',
													fontFamily: 'Roboto Condensed',
												}}>
												admin login
											</a>
										</Typography>
									</Button>
								</div>
							</Toolbar>
						</AppBar>
					</Box>
				</header>
			</ThemeProvider>
			<Login></Login>
		</div>
	);
};

export default Main;
