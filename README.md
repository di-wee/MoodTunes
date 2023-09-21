# MoodTunes: The Spotify Mood-based Playlist Generator

## Description
MoodTunes is a Spotify-based application that curates playlists based on your mood. Utilizing the power of Spotify's vast music library, MoodTunes takes your current mood as input and generates a playlist that you can directly add to your Spotify account. 

Click here for the deployment link: (https://moodtunes.netlify.app/)

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

### Frontend (React.js with MUI and Spotify SDK):

Clone the repository:

```
git clone [your-repo-url]
cd [your-frontend-directory]
```

Install dependencies:

To install React, MUI components, Material UI icons, and Spotify SDK:

````
npm install react @mui/material @mui/icons-material spotify-web-playback-sdk react-draggable
````


Add in environmental variables:

````
VITE_SERVER=http://localhost:8000
````


Start the development server:

````
npm start
````

### Backend (Python, Django, AllAuth):

Navigate to the backend directory:

```
cd [your-backend-directory]
```

Set up a virtual environment:

```
python3 -m venv venv
source venv/bin/activate
```

Install backend dependencies:

Create a requirements.txt file with the following content:

```
Django
django-allauth
django-allauth[providers]
django-cors-headers
psycopg2
```

Then, install the dependencies:

```
pip install -r requirements.txt
```

Setup PostgreSQL:

```
brew install postgresql
```

Start PostgreSQL:

```
pg_ctl -D /usr/local/var/postgres start
```

Create a new database:

```
createdb your_db_name
```

Update the DATABASES setting in your Django project's settings.py with the appropriate PostgreSQL credentials:

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_postgres_user',
        'PASSWORD': 'your_postgres_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

Run migrations:

```
python manage.py migrate
```

Start the Django development server:

```
python manage.py runserver
```


## Screenshots

### Login page:
![Screenshot 2023-09-21 at 11 41 03 AM](https://github.com/di-wee/MoodTunes/assets/135717295/00ada9e1-c5e7-458d-9b95-0a65cedcc12e)


### User Dashboard:
![Screenshot 2023-09-21 at 11 41 21 AM](https://github.com/di-wee/MoodTunes/assets/135717295/609d359f-d03e-433e-8276-1199057fc236)



### Inside a Mood:
![Screenshot 2023-09-21 at 11 41 37 AM](https://github.com/di-wee/MoodTunes/assets/135717295/5dceb14b-0627-4fc2-a649-aa111de82619)



### User Playlist:
![Screenshot 2023-09-21 at 11 42 41 AM](https://github.com/di-wee/MoodTunes/assets/135717295/e811922b-7b50-4afb-af26-d20f980c75fa)


### Admin Login:
<img width="1454" alt="Screenshot 2023-09-14 at 10 07 52 PM" src="https://github.com/di-wee/MoodTunes/assets/135717295/2bac4835-bf85-4db0-9917-57952210cfde">

### Admin Dashboard:
<img width="1439" alt="Screenshot 2023-09-14 at 10 13 54 PM" src="https://github.com/di-wee/MoodTunes/assets/135717295/043b2055-2d80-4b7b-8eeb-34195bc5c82d">







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
