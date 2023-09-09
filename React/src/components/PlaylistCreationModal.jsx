import {
	Box,
	Button,
	Dialog,
	FormControl,
	Input,
	InputLabel,
} from '@mui/material';
import { blue, lightBlue } from '@mui/material/colors';
import React, { useState } from 'react';

const PlaylistCreationModal = (props) => {
	const { setShowModal, showModal } = props;
	const [playlistName, setPlaylistName] = useState('');
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

			if (res.ok) {
				alert('Playlist created!');
			} else {
				alert('Error creating playlist');
			}
		} catch (error) {
			console.log('error:', error);
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
						onClick={onSubmit}
						variant='contained'
						sx={{ backgroundColor: blue[800], marginLeft: '3rem' }}>
						Submit
					</Button>
				</Box>
			</Dialog>
		</div>
	);
};

export default PlaylistCreationModal;
