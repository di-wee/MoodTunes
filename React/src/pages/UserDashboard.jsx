import React, { useEffect, useState } from 'react';
import UserNav from '../components/UserNav';
import UserDisplay from '../components/UserDisplay';

const UserDashboard = () => {
	const [userInfo, setUserInfo] = useState({});
	const savedJWT = localStorage.getItem('storeJWT');

	const getUserDetails = async () => {
		try {
			const res = await fetch(import.meta.env.VITE_SERVER + '/users');
			const data = await res.json();

			if (res.ok) {
				setUserInfo(data);
			} else {
				console.log('error retrieving user details.');
			}
		} catch (error) {
			console.error('error', error);
		}
	};

	const getJWT = async () => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/temp_tokens/get_jwt/'
			);
			const data = res.json();

			if (res.ok) {
				localStorage.setItem('storeJWT', data.token);
			} else {
				console.error('error fetching jwt:', data.error);
			}
		} catch (error) {
			console.error('error', error);
		}
	};

	useEffect(() => {
		getJWT();
		getUserDetails();
		console.log(userInfo);
	}, []);
	return (
		<div>
			<header>
				<UserNav></UserNav>
			</header>
			<UserDisplay></UserDisplay>
		</div>
	);
};

export default UserDashboard;
