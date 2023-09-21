import { Box, Button, Dialog, Typography } from '@mui/material';
import React from 'react';

const DeleteWarningModal = (props) => {
	const {
		playlistId,
		deletePlaylist,
		setShowDeleteModal,
		showDeleteModal,
		playlistName,
	} = props;

	const handleClose = () => {
		setShowDeleteModal('');
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
			open={showDeleteModal}
			onClose={handleClose}
			BackdropProps={{
				style: {
					backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darken the backdrop to enhance focus on the modal.
				},
			}}>
			<Box
				sx={{
					bgcolor: '#121212', // Spotify dark background color
					color: '#FFFFFF', // White text for better readability on dark bg
					p: 4,
					width: '100%',
					maxWidth: 400,
					borderRadius: 2,
				}}
				display='flex'
				alignItems='center'
				justifyContent='center'
				flexDirection='column'>
				<Typography
					variant='h6'
					textAlign={'center'}
					gutterBottom>{`Are you sure you want to delete playlist "${playlistName}"?`}</Typography>

				<Box
					mt={2}
					display='flex'
					justifyContent='space-between'
					width='100%'>
					<Button
						onClick={() => deletePlaylist(playlistId)}
						variant='contained'
						style={{
							backgroundColor: '#1DB954', // Spotify green color
							color: '#FFFFFF',
						}}>
						Yes
					</Button>
					<Button
						onClick={handleClose}
						variant='outlined'
						style={{
							color: '#1DB954',
							borderColor: '#1DB954',
						}}>
						No
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
};

export default DeleteWarningModal;
