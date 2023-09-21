import React, { useState, useEffect, useContext } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	Drawer,
	List,
	ListItem,
	Typography,
	IconButton,
	ButtonBase,
} from '@mui/material';
import PlaylistCreationModal from './PlaylistCreationModal';
import UserContext from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import DeleteWarningModal from './DeleteWarningModal';
import EditPlaylistModal from './EditPlaylistModal';

const spotifyGreen = '#1DB954';
const spotifyGrey = '#B3B3B3';

const UserNav = (props) => {
	const { displaypic, displayname, mood } = props;
	const [showEditModal, setShowEditModal] = useState('');
	const [showDeleteModal, setShowDeleteModal] = useState('');
	const [showModal, setShowModal] = useState(false);
	const userCtx = useContext(UserContext);
	const { getPlaylists, currentMood, getAllPlaylist } = userCtx;
	const jwtTokenKey = 'jwtToken';
	const getJWT = localStorage.getItem(jwtTokenKey);

	const navigate = useNavigate();

	const LogoutFromAccount = () => {
		window.location.href = import.meta.env.VITE_SERVER + '/accounts/logout';
	};

	useEffect(() => {
		getAllPlaylist();
	}, []);

	//setting to prop down
	const handlePlaylistClick = (playlist) => {
		navigate('/user/playlist', {
			state: { playlist: playlist },
		});
	};

	const deletePlaylist = async (playlistId) => {
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER + '/playlists/delete/' + playlistId,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${getJWT}`,
					},
				}
			);

			if (res.ok) {
				getAllPlaylist();
			} else {
			}
			console.log('Error from server:', await res.text());
		} catch (error) {
			console.log('error:', error);
		}
	};

	return (
		<div>
			<Drawer
				variant='permanent'
				anchor='left'
				sx={{
					'& .MuiDrawer-paper': {
						background: 'linear-gradient(45deg, #282828, #1E1E1E)',
						color: '#FFF',
						width: '210px',
						zIndex: 1,
						padding: '1rem',
					},
				}}>
				<List>
					{/* Logo and App Name */}
					<ListItem>
						<Link
							to='/user/dashboard'
							style={{ textDecoration: 'none' }}>
							<Typography
								textAlign={'center'}
								variant='h5'
								sx={{ color: spotifyGreen, fontWeight: 'bold' }}>
								MOOD TUNES
							</Typography>
						</Link>
					</ListItem>
					<Divider sx={{ backgroundColor: spotifyGrey, margin: '0.5rem 0' }} />

					{/* User Details */}
					<ListItem
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							padding: '1rem 2rem',
						}}>
						{displaypic && displaypic[0] ? (
							<Box
								component='img'
								src={displaypic[0].url}
								sx={{
									height: 80,
									width: 80,
									borderRadius: '50%',
									marginBottom: '1rem',
								}}
							/>
						) : (
							<CircularProgress color='inherit' />
						)}
						<Typography
							textAlign={'center'}
							variant='h7'>
							Welcome, {displayname}
						</Typography>
						<Button
							variant='outlined'
							onClick={LogoutFromAccount}
							sx={{
								marginTop: '1rem',
								borderColor: spotifyGrey,
								color: spotifyGrey,
							}}>
							Log out
						</Button>
					</ListItem>
					<Divider sx={{ backgroundColor: spotifyGrey, margin: '0.5rem 0' }} />

					{/* Current Mood */}
					<ListItem
						sx={{
							padding: '1rem 2.5rem',
							alignContent: 'center',
							alignItems: 'center',
						}}>
						<Typography textAlign={'center'}>Current Mood:</Typography>
						<Typography sx={{ color: spotifyGreen, fontWeight: 'bold' }}>
							{currentMood ? currentMood.title : 'N/A'}
						</Typography>
					</ListItem>
					<Divider sx={{ backgroundColor: spotifyGrey, margin: '0.5rem 0' }} />

					{/* User Playlists */}
					<ListItem sx={{ padding: '1rem 2rem', flexDirection: 'column' }}>
						<Typography sx={{ color: spotifyGrey, marginBottom: '1rem' }}>
							Your Playlists:
						</Typography>
						<Button
							variant='contained'
							onClick={() => setShowModal(true)}
							sx={{
								backgroundColor: spotifyGreen,
								color: '#FFF',
								marginBottom: '1rem',
								width: '150%',
								'&:hover': {
									backgroundColor: '#29a745',
								},
							}}>
							Create New Playlist
						</Button>

						{getPlaylists.map((playlist) => (
							<Box
								key={playlist.id}
								sx={{
									display: 'flex',
									alignItems: 'center',
									marginBottom: '1rem',
									justifyContent: 'space-between',
								}}>
								<ButtonBase onClick={() => handlePlaylistClick(playlist)}>
									<Typography sx={{ color: spotifyGrey }}>
										{playlist.name}
									</Typography>
								</ButtonBase>

								<Box sx={{ display: 'flex', gap: '0.5rem' }}>
									<IconButton
										sx={{ padding: '0px', color: spotifyGreen }}
										onClick={() => setShowDeleteModal(playlist.id)}>
										<Delete />
									</IconButton>

									<IconButton
										sx={{ padding: '0px', color: spotifyGreen }}
										onClick={() => setShowEditModal(playlist.id)}>
										<Edit />
									</IconButton>
								</Box>

								{showDeleteModal === playlist.id && (
									<DeleteWarningModal
										deletePlaylist={deletePlaylist}
										playlistId={playlist.id}
										showDeleteModal={showDeleteModal !== ''}
										setShowDeleteModal={setShowDeleteModal}
										playlistName={playlist.name}
									/>
								)}

								{showEditModal === playlist.id && (
									<EditPlaylistModal
										playlistId={playlist.id}
										showEditModal={showEditModal !== ''}
										setShowEditModal={setShowEditModal}
										playlistName={playlist.name}
										getAllPlaylist={getAllPlaylist}
									/>
								)}
							</Box>
						))}
					</ListItem>
				</List>
			</Drawer>
			{showModal && (
				<PlaylistCreationModal
					showModal={showModal}
					setShowModal={setShowModal}
					getAllPlaylist={getAllPlaylist}></PlaylistCreationModal>
			)}
		</div>
	);
};

export default UserNav;
