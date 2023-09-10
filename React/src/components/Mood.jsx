import React, { useContext, useEffect, useState } from 'react';
import UserPlaylist from '../pages/UserPlaylist';
import { Box } from '@mui/material';
import UserContext from '../context/UserContext';
import UserNav from './UserNav';

const Mood = (props) => {
	const [songs, setSongs] = useState([]);
	const { mood } = props;
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);
	const userCtx = useContext(UserContext);
	const { userInfo } = userCtx;

	const getSongsFromMood = async () => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/moods/get_songs/' + mood.title,
				{
					headers: {
						Authorization: `Bearer ${getJWT}`,
					},
				}
			);

			const data = await res.json();

			if (res.ok) {
				setSongs(data);
			} else {
				console.log('error getting songs');
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	useEffect(() => {
		getSongsFromMood();
	}, []);

	return (
		<div>
			<Box sx={{ display: 'flex', flexDirection: 'row' }}>
				<Box sx={{ width: 240 /* Adjust based on the width of your Drawer */ }}>
					<UserNav
						displayname={userInfo.display_name}
						displaypic={userInfo.images}
					/>
				</Box>
				<Box sx={{ flexGrow: 1 }}></Box>
			</Box>
		</div>
	);
};

export default Mood;
