import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import UserPlaylist from './pages/UserPlaylist';
import AdminDashboard from './pages/AdminDashboard';
import Main from './pages/Main';
import { ThemeProvider, createTheme } from '@mui/material';
import { indigo } from '@mui/material/colors';
import UserContext from './context/UserContext';
import SongList from './pages/SongList';
const theme = createTheme({
	typography: {
		fontFamily: 'Roboto Condensed, sans-serif',
	},
});

function App() {
	const [storeUsername, setStoreUsername] = useState();
	const [getPlaylists, setGetPlaylists] = useState([]);
	const [userInfo, setUserInfo] = useState({});
	const [currentMood, setCurrentMood] = useState([]);

	return (
		<UserContext.Provider
			value={{
				storeUsername,
				setStoreUsername,
				getPlaylists,
				setGetPlaylists,
				userInfo,
				setUserInfo,
				currentMood,
				setCurrentMood,
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
							<Route
								path='/user/songlist'
								element={<SongList />}
							/>
						</Routes>
					</ThemeProvider>
				</main>
			</div>
		</UserContext.Provider>
	);
}

export default App;
