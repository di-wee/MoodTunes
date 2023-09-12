import { Box, Button, Dialog, Input, Typography } from '@mui/material';
import { blue, lightBlue } from '@mui/material/colors';
import React, { useState } from 'react';

const DeleteWarningModal = (props) => {
	const {
		playlistId,
		deletePlaylist,
		setShowDeleteModal,
		showDeleteModal,
		playlistName,
	} = props;

	const handleClose = () => {
		setShowDeleteModal(false);
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
				open={showDeleteModal}
				onClose={handleClose}>
				<Box
					sx={style}
					display='flex'
					alignItems='center'
					justifyContent='center'
					flexDirection='column'>
					<Typography
						variant='h6'
						textAlign={'center'}
						sx={{
							color: lightBlue[900],
						}}>{`Are you sure you want to delete playlist ${playlistName}?`}</Typography>
					<Box>
						<Button
							onClick={() => deletePlaylist(playlistId)}
							variant='contained'
							color='primary'
							sx={{ margin: '1rem' }}>
							Yes
						</Button>
						<Button
							onClick={handleClose}
							variant='contained'
							color='primary'>
							No
						</Button>
					</Box>
				</Box>
			</Dialog>
		</div>
	);
};

export default DeleteWarningModal;
