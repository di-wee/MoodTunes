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
import React, { useState, useRef } from 'react';

const EditPlaylistModal = (props) => {
	const {
		setShowEditModal,
		showEditModal,
		getAllPlaylist,
		playlistId,
		playlistName,
	} = props;

	const playlistRef = useRef();

	const [loading, setLoading] = useState(false);
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);

	const handleClose = () => {
		setShowEditModal(false);
	};

	const onSubmit = async () => {
		if (!playlistRef.current.value) {
			return alert('Please enter a playlist name');
		} else {
			EditPlaylistName();
			await setShowEditModal(false);
		}
	};

	const EditPlaylistName = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + `/playlists/${playlistId}/update/`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${getJWT}`,
					},
					body: JSON.stringify({
						name: playlistRef.current.value,
					}),
				}
			);

			const data = await res.json();

			if (res.ok) {
				alert('Playlist updated!');
				getAllPlaylist();
			} else {
				alert(data.error || 'Error updating playlist'); // display the error message from the server
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
				open={showEditModal}
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
							inputRef={playlistRef}
							defaultValue={playlistName}
						/>
					</FormControl>
					<Button
						disabled={loading}
						onClick={onSubmit}
						variant='contained'
						sx={{ backgroundColor: blue[800], marginLeft: '3rem' }}>
						{loading ? 'Creating...' : 'Edit'}
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

export default EditPlaylistModal;
