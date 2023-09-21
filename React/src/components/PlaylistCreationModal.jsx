import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	FormControl,
	Input,
	InputLabel,
} from '@mui/material';
import React, { useState } from 'react';

const PlaylistCreationModal = (props) => {
	const { setShowModal, showModal, getAllPlaylist } = props;
	const [playlistName, setPlaylistName] = useState('');
	const [loading, setLoading] = useState(false);
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);

	const handleClose = () => {
		setShowModal(false);
	};

	const onChange = (event) => {
		setPlaylistName(event.target.value);
	};

	const onSubmit = async () => {
		if (!playlistName) {
			return alert('Please enter a playlist name');
		} else {
			await createPlaylist();
			setShowModal(false);
		}
	};

	const createPlaylist = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playlists/create_playlist/',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${getJWT}`,
					},
					body: JSON.stringify({
						name: playlistName,
					}),
				}
			);

			const data = await res.json();

			if (res.ok) {
				alert('Playlist created!');
				getAllPlaylist();
				setPlaylistName('');
			} else {
				alert(data.error || 'Error creating playlist'); // display the error message from the server
			}
		} catch (error) {
			console.log('error:', error);
			alert('An unexpected error occurred.');
		} finally {
			setLoading(false);
		}
	};

	const style = {
		top: '50%',
		left: '50%',
		width: 400,
		boxShadow: 24,
		p: 4,
	};

	return (
		<div>
			<Dialog
				open={showModal}
				onClose={handleClose}>
				<Box
					component='form'
					sx={{
						top: '50%',
						left: '50%',
						width: 400,
						boxShadow: 24,
						p: 4,
						backgroundColor: '#181818',
						color: 'white',
					}}
					display='flex'
					alignItems='center'>
					<FormControl
						variant='standard'
						mr={2}>
						<InputLabel
							htmlFor='component-simple'
							style={{ color: '#1DB954' }}>
							Playlist Name
						</InputLabel>
						<Input
							fullWidth
							onChange={onChange}
							style={{ color: 'white', borderBottom: '1px solid #1DB954' }}
						/>
					</FormControl>
					<Button
						disabled={loading}
						onClick={onSubmit}
						variant='contained'
						sx={{
							backgroundColor: loading ? '#535353' : '#1DB954',
							marginLeft: '3rem',
						}}>
						{loading ? (
							<CircularProgress
								size={24}
								color='inherit'
							/>
						) : (
							'Submit'
						)}
					</Button>
				</Box>
			</Dialog>
		</div>
	);
};

export default PlaylistCreationModal;
