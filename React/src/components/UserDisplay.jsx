import React from 'react';
import Mood from './Mood';
import { Box, ButtonBase, Typography } from '@mui/material';
import './UserDisplay.css';
import { lightBlue } from '@mui/material/colors';
const UserDisplay = () => {
	const images = [
		{
			url: '/happy.png',
			title: 'Happy',
			width: '35%',
		},
		{
			url: '/sad.png',
			title: 'Sad',
			width: '35%',
		},
		{
			url: '/angry.png',
			title: 'Angry',
			width: '35%',
		},
		{
			url: '/energetic.png',
			title: 'Energetic',
			width: '35%',
		},
		{
			url: '/relaxed.png',
			title: 'Relaxed',
			width: '35%',
		},
		{
			url: '/intense.png',
			title: 'Intense',
			width: '35%',
		},
	];

	return (
		<div>
			<Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '3rem' }}>
				<Typography
					variant='h6'
					textAlign={'center'}
					sx={{ color: lightBlue[900] }}>
					How are you feeling today?
				</Typography>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						minWidth: 300,
						width: '100%',
						justifyContent: 'center',
					}}>
					{images.map((image) => (
						<ButtonBase
							focusRipple
							key={image.title}
							className='imageButton'
							sx={{
								width: image.width,
								margin: '1.5rem',
							}}>
							<span
								className='imageSrc'
								style={{ backgroundImage: `url(${image.url})` }}></span>
							<span className='imageBackdrop'></span>
							<span className='image'>
								<Typography
									sx={{
										position: 'relative',
										padding: '16px',
										paddingTop: '8px',
										paddingBottom: '14px',
									}}>
									{image.title}
									<span className='imageMarked'></span>
								</Typography>
							</span>
						</ButtonBase>
					))}
				</Box>
			</Box>
			<Mood></Mood>
		</div>
	);
};

export default UserDisplay;
