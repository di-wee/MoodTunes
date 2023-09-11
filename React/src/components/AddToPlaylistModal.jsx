import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Typography,
} from '@mui/material';
import { blue, lightBlue } from '@mui/material/colors';
import React, { useState, useContext } from 'react';
import UserContext from '../context/UserContext';
import { AddCircle } from '@mui/icons-material';

const AddToPlaylistModal = (props) => {
	const { setShowModal, showModal } = props;
	const userCtx = useContext(UserContext);
	const { getPlaylists, getAllPlaylist, songId } = userCtx;
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);

	const style = {
		top: '50%',
		left: '50%',
		width: 400,
		boxShadow: 24,
		p: 4,
	};
	const handleClose = () => {
		setShowModal(false);
	};

	const addSongsToPlaylist = async (songid, playlistid) => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + `/playlists/${playlistid}/add_song/`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${getJWT}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						song_id: songid,
					}),
				}
			);

			if (res.ok) {
				getAllPlaylist();
				return alert('Added to playlist!');
			} else {
				console.log('error adding song to playlist');
			}
		} catch (error) {
			console.log('error:', error);
		}
	};

	return (
		<div sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
			<Dialog
				open={showModal}
				onClose={handleClose}>
				<Box
					component='form'
					sx={style}
					display='flex'
					alignItems='center'
					justifyContent='center'>
					<DialogTitle>
						<Typography
							variant='h6'
							textAlign={'center'}
							sx={{ color: lightBlue[900] }}>
							Playlists:
						</Typography>
						<DialogContent>
							{getPlaylists.map((playlist) => (
								<div style={{ display: 'flex' }}>
									<Typography
										key={playlist.id}
										gutterBottom>
										{playlist.name}
									</Typography>
									<AddCircle
										onClick={() => {
											addSongsToPlaylist(songId, playlist.id);
										}}
										color='primary'
										sx={{ marginLeft: '1rem', cursor: 'pointer' }}></AddCircle>
								</div>
							))}
						</DialogContent>
					</DialogTitle>
				</Box>
			</Dialog>
		</div>
	);
};

export default AddToPlaylistModal;
