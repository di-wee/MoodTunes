import React, { useContext, useEffect, useState } from 'react';
import UserNav from '../components/UserNav';
import UserDisplay from '../components/UserDisplay';
import { Box, CircularProgress, Container, Paper } from '@mui/material';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const spotifyBlack = '#121212';
const spotifyGreen = '#1DB954';
const spotifyGrey = '#B3B3B3';

const UserDashboard = () => {
	const userCtx = useContext(UserContext);
	const { userInfo, setUserInfo } = userCtx;
	const [jwt, setJwt] = useState(localStorage.getItem('jwtToken'));
	const savedUsername = localStorage.getItem('username');
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

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
			} else {
				alert('Incorrect spotify username entered, please log in again.');
				navigate('/');
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
		<div style={{ height: '100vh', backgroundColor: spotifyBlack }}>
			<Container maxWidth='lg'>
				{isLoading ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100vh',
						}}>
						<CircularProgress sx={{ color: '#1ED760' }} />
					</Box>
				) : (
					<Paper
						elevation={3}
						sx={{
							display: 'flex',
							flexDirection: 'row',
							backgroundColor: spotifyBlack,
							borderRadius: '20px',
						}}>
						<Box
							sx={{
								width: 240,
								borderRadius: '20px',
								padding: '1rem',
								marginLeft: '-2rem',
								marginTop: '2rem',
							}}>
							<UserNav
								displayname={userInfo.display_name}
								displaypic={userInfo.images}
							/>
						</Box>
						<Box
							sx={{
								flexGrow: 1,
								padding: '1rem',
								margin: '2rem',
							}}>
							<UserDisplay />
						</Box>
					</Paper>
				)}
			</Container>
		</div>
	);
};

export default UserDashboard;
