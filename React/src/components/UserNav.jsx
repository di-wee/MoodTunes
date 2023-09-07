import React, { useState, useEffect } from 'react';
import { Divider, Drawer, List, ListItem, Typography } from '@mui/material';
import { blue, lightBlue } from '@mui/material/colors';

const UserNav = () => {
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
