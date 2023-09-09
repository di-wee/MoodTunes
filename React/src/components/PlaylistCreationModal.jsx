import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	FormControl,
	Input,
	InputLabel,
} from '@mui/material';
import { blue } from '@mui/material/colors';
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
					sx={style}
					display='flex'
					alignItems='center'>
					<FormControl
						variant='standard'
						mr={2}>
						<InputLabel htmlFor='component-simple'>Playlist Name</InputLabel>
						<Input
							fullWidth
							onChange={onChange}
						/>
					</FormControl>
					<Button
						disabled={loading}
						onClick={onSubmit}
						variant='contained'
						sx={{ backgroundColor: blue[800], marginLeft: '3rem' }}>
						{loading ? 'Creating...' : 'Submit'}
					</Button>
					{loading && (
						<CircularProgress
							sx={{ marginLeft: '1rem' }}
							size={24}
						/>
					)}
				</Box>
			</Dialog>
		</div>
	);
};

export default PlaylistCreationModal;
