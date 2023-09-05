import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import UserPlaylist from './pages/UserPlaylist';
import AdminDashboard from './pages/AdminDashboard';
import Main from './pages/Main';

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
