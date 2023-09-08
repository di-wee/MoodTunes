import React, { useState, useEffect } from 'react';
import {
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	Typography,
} from '@mui/material';
import { blue, lightBlue } from '@mui/material/colors';

const UserNav = (props) => {
	const { displaypic, displayname } = props;
	return (
		<Drawer
			variant='permanent'
			anchor='left'
			sx={{ '& .MuiDrawer-paper': { backgroundColor: blue[50] } }}>
			<List>
				<ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
					<Typography
						variant='h6'
						component='div'
						sx={{ color: lightBlue[800] }}>
						MOOD TUNES
					</Typography>
				</ListItem>
				<Divider sx={{ backgroundColor: blue[900] }} />
				<ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
					<Box
						component='img'
						src={displaypic[0].url}
						sx={{
							height: '70%',
							width: '70%',
							borderRadius: '50%',
							borderBlockColor: 'white',
							marginTop: '1rem',
							marginBottom: '1rem',
						}}></Box>
					<Typography sx={{ color: lightBlue[900] }}>
						Welcome back, {displayname}
					</Typography>
				</ListItem>
				<Divider sx={{ backgroundColor: blue[900] }} />
				<ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
					<Typography sx={{ color: lightBlue[900] }}>Current Mood:</Typography>
				</ListItem>
				<Divider sx={{ backgroundColor: blue[900] }} />
				<ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
					<Typography sx={{ color: lightBlue[900] }}>Playlists:</Typography>
				</ListItem>
			</List>
		</Drawer>
	);
};

export default UserNav;
