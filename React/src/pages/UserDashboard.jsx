import React, { useEffect, useState } from 'react';
import UserNav from '../components/UserNav';
import UserDisplay from '../components/UserDisplay';
import { Box, CircularProgress } from '@mui/material';

const UserDashboard = () => {
	const [userInfo, setUserInfo] = useState({});
	const [jwt, setJwt] = useState(localStorage.getItem('jwtToken'));
	const savedUsername = localStorage.getItem('username');
	const [isLoading, setIsLoading] = useState(true);

	const getUserDetails = async (jwtToken) => {
		try {
			const res = await fetch(import.meta.env.VITE_SERVER + '/users', {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			});
			const data = await res.json();

			if (res.ok) {
				setUserInfo(data.extra_data);
			} else {
				console.log('error retrieving user details.');
			}
		} catch (error) {
			console.error('error', error);
		} finally {
			setIsLoading(false);
		}
	};

	const getTempToken = async () => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/temp_tokens/get_temp_code/',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: savedUsername,
					}),
				}
			);

			const data = await res.json();

			if (res.ok) {
				return data.temptoken.temp_token;
			}
		} catch (error) {
			console.error('error:', error);
		}
	};

	const getJWT = async (token) => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/temp_tokens/get_jwt/',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						temp_token: token,
					}),
				}
			);
			const data = await res.json();

			if (res.ok) {
				localStorage.setItem('jwtToken', data.token);
				return data.token;
			}
		} catch (error) {
			console.error('error:', error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const token = await getTempToken();
			if (token) {
				const newJwt = await getJWT(token);
				if (newJwt) {
					setJwt(newJwt);
					await getUserDetails(newJwt);
					console.log(userInfo);
				}
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			{isLoading ? (
				<CircularProgress />
			) : (
				<Box sx={{ display: 'flex', flexDirection: 'row' }}>
					<Box
						sx={{ width: 240 /* Adjust based on the width of your Drawer */ }}>
						<UserNav
							displayname={userInfo.display_name}
							displaypic={userInfo.images}
						/>
					</Box>
					<Box sx={{ flexGrow: 1 }}>
						<UserDisplay />
					</Box>
				</Box>
			)}
		</div>
	);
};

export default UserDashboard;
