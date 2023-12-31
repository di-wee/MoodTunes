import React, { useContext } from 'react';
import Tracks from '../components/Tracks';
import UserNav from '../components/UserNav';
import { useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Box, Button } from '@mui/material';

const UserPlaylist = () => {
	const userCtx = useContext(UserContext);
	const { userInfo } = userCtx;
	const location = useLocation();
	let playlistId, playlist;

	if (location && location.state) {
		playlistId = location.state.playlistId;
		playlist = location.state.playlist;
	}

	return (
		<div>
			<Box sx={{ display: 'flex', flexDirection: 'row' }}>
				<Box sx={{ width: 220 /* Adjust based on the width of your Drawer */ }}>
					<UserNav
						displayname={userInfo.display_name}
						displaypic={userInfo.images}
					/>
				</Box>
				<Box sx={{ flexGrow: 1 }}>
					<Tracks playlist={playlist}></Tracks>
				</Box>
			</Box>
		</div>
	);
};

export default UserPlaylist;
