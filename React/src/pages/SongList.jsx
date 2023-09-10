import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import UserNav from '../components/UserNav';
import UserContext from '../context/UserContext';
import { Box, Button } from '@mui/material';
import Mood from '../components/Mood';

const SongList = () => {
	const userCtx = useContext(UserContext);
	const { userInfo } = userCtx;
	const location = useLocation();
	let mood;

	if (location && location.state) {
		mood = location.state.mood;
	}
	return (
		<div>
			<Box sx={{ display: 'flex', flexDirection: 'row' }}>
				<Box sx={{ width: 240 /* Adjust based on the width of your Drawer */ }}>
					<UserNav
						displayname={userInfo.display_name}
						displaypic={userInfo.images}
					/>
				</Box>
				<Box sx={{ flexGrow: 1 }}>
					<Mood mood={mood}></Mood>
				</Box>
			</Box>
		</div>
	);
};

export default SongList;
