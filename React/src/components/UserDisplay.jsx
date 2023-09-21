import React, { useContext, useEffect, useState } from 'react';
import { Box, ButtonBase, Typography, Paper } from '@mui/material';
import './UserDisplay.css';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const spotifyGreen = '#1DB954';
const spotifyBlack = '#121212';
const spotifyGrey = '#B3B3B3';
const UserDisplay = () => {
	const [mood, setMood] = useState([]);
	const userCtx = useContext(UserContext);
	const { setCurrentMood } = userCtx;
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);

	const navigate = useNavigate();

	const handleMoodClick = (mood) => {
		setCurrentMood(mood);
		navigate('/user/songlist');
	};
	const getMoods = async () => {
		try {
			const res = await fetch(import.meta.env.VITE_SERVER + '/moods/', {
				headers: {
					Authorization: `Bearer ${getJWT}`,
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();

			if (res.ok) {
				const imagesUrl = [
					'/angry.png',
					'/energetic.png',
					'/happy.png',
					'/intense.png',
					'/relaxed.png',
					'/sad.png',
					'/whatever.png',
				];

				const images = data.map((mood, index) => ({
					url: imagesUrl[index],
					width: '35%',
					title: mood.name,
				}));

				setMood(images);
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	useEffect(() => {
		getMoods();
	}, []);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: spotifyBlack,
				color: spotifyGreen,
				padding: '2rem',
				height: '100%',
				alignItems: 'center',
				gap: '2rem',
			}}>
			<Typography
				variant='h4'
				gutterBottom>
				How are you feeling today?
			</Typography>
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '2rem',
					justifyContent: 'center',
					width: '100%',
				}}>
				{mood.map((mood) => (
					<ButtonBase
						onClick={() => handleMoodClick(mood)}
						focusRipple
						key={mood.title}
						className='imageButton'
						sx={{
							backgroundImage: `url(${mood.url})`,
							width: '120px',
							height: '120px',
							backgroundSize: 'cover',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center',
							position: 'relative',
							borderRadius: '20%',
							overflow: 'hidden',
							'&:hover .imageBackdrop': {
								opacity: 0.15,
							},
							'&:hover .imageMarked': {
								opacity: 0,
							},
						}}>
						<span
							className='imageSrc'
							style={{ backgroundImage: `url(${mood.url})` }}></span>
						<span className='imageBackdrop'></span>
						<span className='image'>
							<Typography
								variant='subtitle1'
								color='inherit'
								className='imageTitle'>
								{mood.title}
								<span className='imageMarked'></span>
							</Typography>
						</span>
					</ButtonBase>
				))}
			</Box>
		</Box>
	);
};

export default UserDisplay;
