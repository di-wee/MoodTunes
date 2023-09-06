import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import UserPlaylist from './pages/UserPlaylist';
import AdminDashboard from './pages/AdminDashboard';
import Main from './pages/Main';
import { ThemeProvider, createTheme } from '@mui/material';
import { indigo } from '@mui/material/colors';
const theme = createTheme({
	typography: {
		fontFamily: 'Roboto Condensed, sans-serif',
	},
});
function App() {
	return (
		<div style={{ backgroundColor: indigo[800] }}>
			<main>
				<ThemeProvider theme={theme}>
					<Routes>
						<Route
							path='/'
							element={<Main />}
						/>
						<Route
							path='/user/dashboard'
							element={<UserDashboard />}
						/>
						<Route
							path='/user/playlist'
							element={<UserPlaylist />}
						/>
						<Route
							path='/admin/dashboard'
							element={<AdminDashboard />}
						/>
					</Routes>
				</ThemeProvider>
			</main>
		</div>
	);
}

export default App;
