import React, { useState, useEffect } from 'react';
import { Divider, Drawer, List, ListItem, Typography } from '@mui/material';
import { blue, lightBlue } from '@mui/material/colors';

const UserNav = () => {
	const [userInfo, setUserInfo] = useState([]);

	// const fetchJWT = async () => {
	// 	try {
	// 		const res = await fetch(
	// 			import.meta.env.VITE_SERVER + '/users/jwt_access/'
	// 		);
	// 		const data = await res.json();
	// 		if (data.access_token) {
	// 			localStorage.setItem('jwtToken', data.access_token);
	// 			console.log('Fetched JWT:', data.access_token);
	// 		} else {
	// 			console.error('error retrieving JWT Token');
	// 		}
	// 	} catch (error) {
	// 		console.error('error:', error);
	// 	}
	// };
	// const getUserDetails = async () => {
	// 	const jwtToken = localStorage.getItem('jwtToken');

	// 	try {
	// 		const res = await fetch(import.meta.env.VITE_SERVER + '/users', {
	// 			headers: {
	// 				Authorization: `Bearer ${jwtToken}`,
	// 			},
	// 		});
	// 		const data = await res.json();
	// 		if (res.ok) {
	// 			setUserInfo(data);
	// 		} else {
	// 			console.log('error getting user details');
	// 		}
	// 	} catch (error) {
	// 		console.error('msg:', error);
	// 	}
	// };

	// // const init = async () => {
	// // 	await fetchJWT();
	// // 	getUserDetails();
	// // };

	// useEffect(() => {
	// 	// init();
	// 	fetchJWT();
	// 	console.log(userInfo);
	// }, []);

	return (
		<Drawer
			variant='permanent'
			anchor='left'
			sx={{ '& .MuiDrawer-paper': { backgroundColor: blue[50] } }}>
			<List>
				<ListItem>
					<Typography
						variant='h6'
						component='div'
						sx={{ color: lightBlue[800] }}>
						MOOD TUNES
					</Typography>
				</ListItem>
				<Divider />
				<ListItem></ListItem>
			</List>
		</Drawer>
	);
};

export default UserNav;
