import React, { useContext, useEffect, useState } from 'react';
import Mood from './Mood';
import { Box, ButtonBase, Typography } from '@mui/material';
import './UserDisplay.css';
import { lightBlue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
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
					{mood.map((mood) => (
						<ButtonBase
							onClick={() => {
								handleMoodClick(mood);
							}}
							focusRipple
							key={mood.id}
							className='imageButton'
							sx={{
								width: mood.width,
								margin: '1.5rem',
							}}>
							<span
								className='imageSrc'
								style={{ backgroundImage: `url(${mood.url})` }}></span>
							<span className='imageBackdrop'></span>
							<span className='image'>
								<Typography
									sx={{
										position: 'relative',
										padding: '16px',
										paddingTop: '8px',
										paddingBottom: '14px',
									}}>
									{mood.title}
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
