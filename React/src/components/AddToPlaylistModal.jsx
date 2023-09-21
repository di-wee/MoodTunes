import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Typography,
} from '@mui/material';
import React, { useContext } from 'react';
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
		<div>
			<Dialog
				open={showModal}
				onClose={handleClose}
				PaperProps={{
					style: {
						backgroundColor: '#181818',
						color: 'white',
					},
				}}>
				<Box
					component='form'
					justifyContent='center'
					sx={style}
					display='flex'
					flexDirection='column'
					alignItems='center'>
					<DialogTitle>
						<Typography
							variant='h6'
							textAlign={'center'}
							sx={{ color: 'white' }}>
							Playlists:
						</Typography>
					</DialogTitle>
					<DialogContent sx={{ color: 'white', width: '100%' }}>
						{getPlaylists.map((playlist) => (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '1rem',
								}}>
								<Typography
									key={playlist.id}
									gutterBottom>
									{playlist.name}
								</Typography>
								<AddCircle
									onClick={() => {
										addSongsToPlaylist(songId, playlist.id);
									}}
									color='action'
									sx={{ color: '#1DB954', cursor: 'pointer' }}
								/>
							</div>
						))}
					</DialogContent>
				</Box>
			</Dialog>
		</div>
	);
};

export default AddToPlaylistModal;
