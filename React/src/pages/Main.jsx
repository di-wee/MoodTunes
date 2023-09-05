import React from 'react';
import Login from '../components/Login';
import {
	AppBar,
	Box,
	ThemeProvider,
	Toolbar,
	Typography,
	createTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import '@fontsource/roboto-condensed';
import { blue, lightBlue } from '@mui/material/colors';

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
							<Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
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
