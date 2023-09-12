import React, { useState, useEffect, useContext } from 'react';
import {
	Box,
	Button,
	ButtonBase,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	Typography,
} from '@mui/material';
import { blue, lightBlue } from '@mui/material/colors';
import PlaylistCreationModal from './PlaylistCreationModal';
import UserContext from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Delete } from '@mui/icons-material';

const UserNav = (props) => {
	const { displaypic, displayname, mood } = props;
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
				sx={{ '& .MuiDrawer-paper': { backgroundColor: blue[50] } }}>
				<List>
					<ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
						<Link
							to='/user/dashboard/'
							style={{ textDecoration: 'none' }}>
							<Typography
								variant='h6'
								component='div'
								sx={{ color: lightBlue[800] }}>
								MOOD TUNES
							</Typography>
						</Link>
					</ListItem>
					<Divider sx={{ backgroundColor: blue[900] }} />
					<ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
						<Box
							component='img'
							src={displaypic[0].url}
							sx={{
								height: '70%',
								width: '70%',
								borderRadius: '50%',
								borderBlockColor: 'white',
								marginTop: '1rem',
								marginBottom: '1rem',
							}}></Box>
						<Typography sx={{ color: lightBlue[900] }}>
							Welcome back, {displayname}
						</Typography>
						<Button onClick={LogoutFromAccount}>
							<Typography>Log out</Typography>
						</Button>
					</ListItem>
					<Divider sx={{ backgroundColor: blue[900] }} />
					<ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
						<Typography sx={{ color: lightBlue[900] }}>
							Current Mood:
						</Typography>
						<Typography sx={{ color: lightBlue[600] }}>
							{currentMood ? currentMood.title : ''}
						</Typography>
					</ListItem>
					<Divider sx={{ backgroundColor: blue[900] }} />
					<ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
						<Typography sx={{ color: lightBlue[900] }}>Playlists:</Typography>
						<Button
							onClick={() => setShowModal(true)}
							sx={{
								backgroundColor: blue[100],
								marginTop: '0.5rem',
							}}>
							Create New Playlist
						</Button>
						{getPlaylists.map((playlist) => (
							<>
								<Box
									key={playlist.id}
									sx={{
										display: 'flex',
										alignItems: 'center',
										marginTop: '0.5rem',
									}}>
									<ButtonBase
										sx={{ marginTop: '0.5rem' }}
										onClick={() => handlePlaylistClick(playlist)}>
										<Typography sx={{ color: lightBlue[900] }}>
											{playlist.name}
										</Typography>
									</ButtonBase>
									<IconButton onClick={() => deletePlaylist(playlist.id)}>
										<Delete></Delete>
									</IconButton>
								</Box>
							</>
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
