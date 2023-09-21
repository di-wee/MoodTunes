import React, { useContext } from 'react';
import UserNav from '../components/UserNav';
import UserContext from '../context/UserContext';
import { Box, Button } from '@mui/material';
import Mood from '../components/Mood';

const SongList = () => {
	const userCtx = useContext(UserContext);
	const { userInfo, currentMood } = userCtx;

	return (
		<div>
			<Box sx={{ display: 'flex', flexDirection: 'row' }}>
				<Box sx={{ width: 210 /* Adjust based on the width of your Drawer */ }}>
					<UserNav
						displayname={userInfo.display_name}
						displaypic={userInfo.images}
						mood={currentMood}
					/>
				</Box>
				<Box sx={{ flexGrow: 1 }}>
					<Mood mood={currentMood}></Mood>
				</Box>
			</Box>
		</div>
	);
};

export default SongList;
