import React from 'react';
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Login from './components/Login';
import UserDashboard from './pages/UserDashboard';
import UserPlaylist from './pages/UserPlaylist';
import AdminDashboard from './pages/AdminDashboard';

function App() {
	return (
		<div>
			<main>
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
			</main>
		</div>
	);
}

export default App;
