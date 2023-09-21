import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	FormControl,
	Input,
	InputLabel,
} from '@mui/material';
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
		setShowEditModal('');
	};

	const onSubmit = async () => {
		if (!playlistRef.current.value) {
			return alert('Please enter a playlist name');
		} else {
			EditPlaylistName();
			await setShowEditModal('');
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
		<Dialog
			open={showEditModal}
			onClose={handleClose}
			BackdropProps={{
				style: {
					backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark backdrop
				},
			}}>
			<Box
				component='form'
				sx={{
					bgcolor: '#121212', // Spotify dark background
					color: '#FFFFFF', // White text
					p: 4,
					width: '100%',
					maxWidth: 400,
					borderRadius: 2,
				}}
				display='flex'
				flexDirection='column'
				alignItems='center'>
				<FormControl
					variant='standard'
					fullWidth>
					<InputLabel
						htmlFor='component-simple'
						sx={{ color: '#FFFFFF' }}>
						Playlist Name
					</InputLabel>
					<Input
						fullWidth
						inputRef={playlistRef}
						defaultValue={playlistName}
						sx={{
							color: '#FFFFFF',
							border: '1px solid #444',
							bgcolor: '#282828',
							borderRadius: 2,
							'&:hover': {
								borderColor: '#1DB954',
							},
							'&.Mui-focused': {
								borderColor: '#1DB954',
							},
						}}
					/>
				</FormControl>

				<Box
					mt={3}
					display='flex'
					alignItems='center'
					width='100%'>
					<Button
						fullWidth
						disabled={loading}
						onClick={onSubmit}
						variant='contained'
						style={{
							backgroundColor: '#1DB954', // Spotify green
							color: '#FFFFFF',
						}}>
						{loading ? 'Creating...' : 'Submit'}
					</Button>
					{loading && (
						<CircularProgress
							sx={{ marginLeft: '1rem' }}
							size={24}
							color='inherit'
						/>
					)}
				</Box>
			</Box>
		</Dialog>
	);
};

export default EditPlaylistModal;
