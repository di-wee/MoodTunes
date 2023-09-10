import React, { useEffect, useState } from 'react';

import { Box, Pagination, Typography } from '@mui/material';

import { lightBlue } from '@mui/material/colors';
import {
	FastForward,
	FastRewind,
	PauseCircle,
	PlayCircle,
} from '@mui/icons-material';

const Mood = (props) => {
	const [songs, setSongs] = useState([]);
	const { mood } = props;
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);

	// pagination logic
	const [page, setPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(songs.length / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = page * itemsPerPage;

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const getSongsFromMood = async () => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/moods/get_songs/' + mood.title,
				{
					headers: {
						Authorization: `Bearer ${getJWT}`,
					},
				}
			);

			const data = await res.json();

			if (res.ok) {
				setSongs(data);
			} else {
				console.log('error getting songs');
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	useEffect(() => {
		getSongsFromMood();
	}, []);

	const playSong = async (uriLink) => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playbacks/play/',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${getJWT}`,
					},
					body: JSON.stringify({
						uri: uriLink,
					}),
				}
			);

			if (res.ok) {
				console.log('song successfully played');
			} else {
				console.log('error playing song');
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				height: '100vh',
			}}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '3rem',
					alignItems: 'center', // This ensures children are centered
				}}>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						minWidth: '40%',
						width: '40%', // Set the width for the title
						alignItems: 'center',
						justifyContent: 'center',
						height: '4rem',
						backgroundColor: lightBlue[50],
						borderRadius: '5%',
					}}>
					<Typography
						variant='h6'
						textAlign={'center'}
						sx={{ color: lightBlue[900] }}>
						{mood.title} Songs:
					</Typography>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column', // Ensure this is set to column
						flexWrap: 'nowrap', // This ensures that children do not wrap
						minWidth: 600,
						width: '100%',
						marginTop: '1rem',
						padding: '1rem',
						backgroundColor: lightBlue[100],
					}}>
					{songs.slice(startIndex, endIndex).map((song, index) => (
						<div
							key={index}
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '10px',
								justifyContent: 'space-between',
							}}>
							<Box sx={{ marginRight: '1rem' }}>
								<Typography>Song: {song.name}</Typography>
								<Typography>Artist: {song.artist}</Typography>
							</Box>
							<Box>
								<PlayCircle
									onClick={() => {
										playSong(song.uri);
									}}
									color='primary'
									style={{ cursor: 'pointer' }}></PlayCircle>
								<PauseCircle
									color='primary'
									style={{ cursor: 'pointer' }}></PauseCircle>
							</Box>
						</div>
					))}
				</Box>
				<Pagination
					sx={{ marginTop: '2rem' }}
					color='primary'
					count={totalPages}
					page={page}
					onChange={handlePageChange}></Pagination>
			</Box>
		</div>
	);
};

export default Mood;
