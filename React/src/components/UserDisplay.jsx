import React, { useEffect, useState } from 'react';
import Mood from './Mood';
import { Box, ButtonBase, Typography } from '@mui/material';
import './UserDisplay.css';
import { lightBlue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
const UserDisplay = () => {
	const [images, setImages] = useState([]);
	const navigate = useNavigate();

	const handleMoodClick = (mood) => {
		navigate('/user/songlist', {
			state: { mood: mood },
		});
	};
	const getMoods = async () => {
		try {
			const res = await fetch(import.meta.env.VITE_SERVER + '/moods/');
			const data = await res.json();

			if (res.ok) {
				const imagesUrl = [
					'/happy.png',
					'/sad.png',
					'/angry.png',
					'/relaxed.png',
					'/energetic.png',
					'/intense.png',
					'/whatever.png',
				];

				const images = data.map((mood, index) => ({
					url: imagesUrl[index],
					width: '35%',
					title: mood.name,
				}));

				setImages(images);
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	useEffect(() => {
		getMoods();
	}, []);

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
							onClick={() => {
								handleMoodClick(image);
							}}
							focusRipple
							key={image.id}
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
		</div>
	);
};

export default UserDisplay;
