import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import UserPlaylist from './pages/UserPlaylist';
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
	const [deviceId, setDeviceId] = useState('');
	const [songId, setSongId] = useState('');
	const [isPaused, setPaused] = useState(null);
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);

	const getAllPlaylist = async () => {
		try {
			const res = await fetch(import.meta.env.VITE_SERVER + '/playlists/get/', {
				headers: {
					Authorization: `Bearer ${getJWT}`,
				},
			});

			const data = await res.json();

			if (res.ok) {
				setGetPlaylists(data);
			} else {
				console.log('error getting playlists');
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	useEffect(() => {
		getAllPlaylist();
	}, []);

	return (
		<UserContext.Provider
			value={{
				songId,
				setSongId,
				storeUsername,
				setStoreUsername,
				getPlaylists,
				setGetPlaylists,
				getAllPlaylist,
				userInfo,
				setUserInfo,
				currentMood,
				setCurrentMood,
				deviceId,
				setDeviceId,
				isPaused,
				setPaused,
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
