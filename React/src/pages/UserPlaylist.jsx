import React, { useContext } from 'react';
import Tracks from '../components/Tracks';
import UserNav from '../components/UserNav';
import { useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';

const UserPlaylist = () => {
	const userCtx = useContext(UserContext);
	const { userInfo } = userCtx;
	const location = useLocation();
	const { playlistId, playlist } = location.state;

	return (
		<div>
			<UserNav
				displayname={userInfo.display_name}
				displaypic={userInfo.images}></UserNav>
			<Tracks></Tracks>
		</div>
	);
};

export default UserPlaylist;
