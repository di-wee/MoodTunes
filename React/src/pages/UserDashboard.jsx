import React, { useContext, useEffect, useState } from 'react';
import UserNav from '../components/UserNav';
import UserDisplay from '../components/UserDisplay';
import UserContext from '../context/UserContext';

const UserDashboard = () => {
	const [userInfo, setUserInfo] = useState({});
	const savedJWT = localStorage.getItem('jwtToken');
	const [jwt, setJwt] = useState(savedJWT);
	const savedUsername = localStorage.getItem('username');
	const userCtx = useContext(UserContext);
	const { storeUsername } = userCtx;
	const [tempToken, setTempToken] = useState('');

	const headers = {
		Authorization: `Bearer ${jwt}`,
	};

	const getUserDetails = async () => {
		try {
			const res = await fetch(import.meta.env.VITE_SERVER + '/users', {
				headers: headers,
			});
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
				setTempToken(data.temptoken.temp_token);
				return data.temptoken.temp_token;
			} else {
				console.log('error getting temp token');
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
			} else {
				console.log('error storing jwt token');
				return false;
			}
		} catch (error) {
			console.error('error:', error);
		}
	};

	const fetchTokens = async () => {
		const token = await getTempToken();
		if (token) {
			const newJwt = await getJWT(token);
			if (newJwt) {
				setJwt(newJwt);
			}
		}
	};
	useEffect(() => {
		fetchTokens();
	}, []);

	useEffect(() => {
		if (jwt) {
			getUserDetails();
		}
		console.log(userInfo);
	}, [jwt]);

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
