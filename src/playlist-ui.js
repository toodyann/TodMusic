// Playlist UI rendering

import { getPlaylists, deletePlaylist, removeTrackFromPlaylist } from './playlist.js';
import { formatDuration } from './utils.js';
import { playTrack, pausePlayer, getPlayingTrackId, isPlaying } from './player.js';

const playlistsList = document.getElementById('playlistsList');

export const renderPlaylists = () => {
    const playlists = getPlaylists();

    if (playlists.length === 0) {
        playlistsList.innerHTML = '<p class="placeholder">Немає плейлистів. Створіть перший!</p>';
        return;
    }

    playlistsList.innerHTML = playlists.map(playlist => `
        <div class="playlist-card">
            <div class="playlist-header-card">
                <div class="playlist-info">
                    <div class="playlist-name">${playlist.name}</div>
                    <div class="playlist-stats">${playlist.tracks.length} трек${playlist.tracks.length !== 1 ? 'ів' : ''}</div>
                </div>
                <button class="delete-playlist-btn" data-playlist-id="${playlist.id}" title="Видалити"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
              </svg></button>
            </div>
            <div class="playlist-tracks" id="playlist-${playlist.id}">
                ${playlist.tracks.length === 0 ? '<p class="placeholder-small">Плейліст порожний</p>' : ''}
                ${playlist.tracks.map((track, idx) => `
                    <div class="playlist-track-item">
                        <span class="playlist-track-num">${idx + 1}</span>
                        <div class="playlist-track-info">
                            <div class="playlist-track-title">${track.title}</div>
                            <div class="playlist-track-artist">${track.artist}</div>
                        </div>
                        <span class="playlist-track-duration">${formatDuration(track.duration)}</span>
                        <button class="play-track-btn" data-playlist-id="${playlist.id}" data-track-id="${track.id}" title="Запустити"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                      </svg></button>
                        <button class="remove-track-btn" data-playlist-id="${playlist.id}" data-track-id="${track.id}" title="Видалити"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                      </svg></button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    attachPlaylistEventListeners();
};

const attachPlaylistEventListeners = () => {
    document.querySelectorAll('.delete-playlist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Ви впевнені? Цю дію не можна відмінити.')) {
                const playlistId = parseInt(btn.dataset.playlistId);
                deletePlaylist(playlistId);
                renderPlaylists();
            }
        });
    });

    document.querySelectorAll('.remove-track-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const playlistId = parseInt(btn.dataset.playlistId);
            const trackId = parseInt(btn.dataset.trackId);
            removeTrackFromPlaylist(playlistId, trackId);
            renderPlaylists();
        });
    });

    document.querySelectorAll('.play-track-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const playlistId = parseInt(btn.dataset.playlistId);
            const trackId = parseInt(btn.dataset.trackId);
            const playlists = getPlaylists();
            const playlist = playlists.find(p => p.id === playlistId);
            
            if (!playlist) return;
            
            const track = playlist.tracks.find(t => t.id === trackId);
            if (!track) return;
            
            const playingTrackId = getPlayingTrackId();
            
            if (playingTrackId === trackId && isPlaying()) {
                pausePlayer();
            } else {
                playTrack(track);
            }
        });
    });
};

export const clearPlaylistUI = () => {
    playlistsList.innerHTML = '';
};
