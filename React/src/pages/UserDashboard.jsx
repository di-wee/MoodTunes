import React from 'react';
import UserNav from '../components/UserNav';
import UserDisplay from '../components/UserDisplay';

const UserDashboard = () => {
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
