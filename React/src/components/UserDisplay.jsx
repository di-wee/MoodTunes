import React from 'react';
import Mood from './Mood';
import { Box, Typography } from '@mui/material';

const UserDisplay = () => {
	const styling = {
		backgroundColor: 'rgba(255,255,255, 0.5)',
		borderColor: 'rgba(255,255,255, 0.7)',
		border: '2px solid rgba(128, 128, 128, 0.9)',
		borderRadius: '5px',
		padding: '16px',
		margin: '0 6rem 0 6rem',
	};

	return (
		<div>
			<Box sx={{ styling }}>
				<Typography
					variant='h6'
					textAlign={'center'}>
					How are you feeling today?
				</Typography>
			</Box>
			<Mood></Mood>
		</div>
	);
};

export default UserDisplay;
