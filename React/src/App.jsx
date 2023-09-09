import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import UserPlaylist from './pages/UserPlaylist';
import AdminDashboard from './pages/AdminDashboard';
import Main from './pages/Main';
import { ThemeProvider, createTheme } from '@mui/material';
import { indigo } from '@mui/material/colors';
import UserContext from './context/UserContext';
const theme = createTheme({
	typography: {
		fontFamily: 'Roboto Condensed, sans-serif',
	},
});

function App() {
	const [storeUsername, setStoreUsername] = useState();
	const [getPlaylists, setGetPlaylists] = useState([]);

	return (
		<UserContext.Provider
			value={{
				storeUsername,
				setStoreUsername,
				getPlaylists,
				setGetPlaylists,
			}}>
			<div style={{ backgroundColor: indigo[100] }}>
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
		</UserContext.Provider>
	);
}

export default App;
