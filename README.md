# MoodTunes: The Spotify Mood-based Playlist Generator

## Description
MoodTunes is a Spotify-based application that curates playlists based on your mood. Utilizing the power of Spotify's vast music library, MoodTunes takes your current mood as input and generates a playlist that you can directly add to your Spotify account.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Screenshots](#screenshots)
- [API Endpoints](#api-endpoints)
- [Data Model](#data-model)
- [Next Steps](#next-steps)

## Features

### User Authentication and Account Syncing
- Spotify Login: Users can easily authenticate themselves using their Spotify account.
- Account Sync: Upon login, MoodTunes syncs with your Spotify account, making it easy to manage your playlists from within the app.
  
### Mood-Based Curated Choices
- Mood Selection: Users are presented with a variety of moods to choose from, such as "Happy," "Sad," "Energetic," etc.
- Curated Songs: Once a mood is selected, the app curates a list of songs that resonate with the chosen mood.

### Playlist Management
- Create Playlist: Users can create a new playlist right within MoodTunes. This playlist is also created in their synced Spotify account.
- Add to Playlist: Add songs from the curated list to your newly created or existing playlists.
- Edit Playlist: Easily remove songs you no longer wish to have in your playlist.

### Cross-Platform Listening Experience
- On-Site Playback: Users can listen to their playlists directly through MoodTunes' built-in player.
- Spotify Playback: Alternatively, the playlists are fully accessible and can be played directly from the Spotify app.

### Playlist Syncing
- Two-Way Sync: Any changes made to your playlists—whether songs are added or removed—are reflected in real-time both on MoodTunes and your Spotify account.

## Tech Stack
- Frontend: React.js
- Component Library: Material UI (MUI)
- Backend: Python, Django
- Database: PostgreSQL
- 3rd Party API: Spotify API

## Installation 


## Screenshots


## API Endpoints
The MoodTunes API offers various endpoints for managing users, moods, songs, playlists, playbacks, and temporary tokens.

| Method  | Endpoint                              | Description                                       |
| ------- | ------------------------------------- | ------------------------------------------------- |
| GET     | `/users/`                             | Get User Details                                  |
| GET     | `/moods/`                             | Get All Moods                                     |
| GET     | `/moods/get_songs/<str:mood>`         | Get Songs from a Mood                             |
| GET     | `/songs/admin/search/`                | Spotify Search                                    |
| POST    | `/playlists/create_playlist/`         | Create Playlist                                   |
| GET     | `/playlists/get/`                     | Get All Playlists                                 |
| GET     | `/playlists/get/<int:playlist_id>/`   | Get Single Playlist                               |
| POST    | `/playlists/<int:playlist_id>/add_song/`| Add Song to Playlist                             |
| DELETE  | `/playlists/delete/<int:playlist_id>/`| Delete Playlist                                   |
| GET     | `/playlists/<int:playlist_id>/get_songs/`| Get Songs from Playlist                         |
| DELETE  | `/playlists/<int:playlist_id>/delete_song/`| Delete Song from Playlist                      |
| POST    | `/playbacks/play/`                    | Play Track                                        |
| POST    | `/playbacks/play_playlist/`           | Play Songs from Playlist                          |
| POST    | `/playbacks/pause/`                   | Pause                                             |
| POST    | `/playbacks/previous_track/`          | Previous Track                                    |
| POST    | `/playbacks/next_track/`              | Next Track                                        |
| GET     | `/playbacks/spotify_token/`           | Get Spotify Token                                 |
| GET     | `/temp_tokens/get_jwt/`               | Exchange Temp Token for JWT                       |
| GET     | `/temp_tokens/get_temp_code/`         | Get Temp Code by Identifier                       |




## Data Model
<img width="1279" alt="Screenshot 2023-09-13 at 11 08 47 AM" src="https://github.com/di-wee/MoodTunes/assets/135717295/c07b4b80-767c-4b7e-93b4-cb50cc59962b">
