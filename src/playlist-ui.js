// Playlist UI rendering

import { getPlaylists, deletePlaylist, removeTrackFromPlaylist } from './playlist.js';
import { formatDuration } from './utils.js';
import { playTrack } from './player.js';

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
                <button class="delete-playlist-btn" data-playlist-id="${playlist.id}" title="Видалити">🗑️</button>
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
                        <button class="play-track-btn" data-track-id="${track.id}" data-playlist-id="${playlist.id}" title="Запустити">▶</button>
                        <button class="remove-track-btn" data-playlist-id="${playlist.id}" data-track-id="${track.id}" title="Видалити">✕</button>
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
            if (playlist) {
                const track = playlist.tracks.find(t => t.id === trackId);
                if (track) {
                    playTrack(track);
                }
            }
        });
    });
};

export const clearPlaylistUI = () => {
    playlistsList.innerHTML = '';
};
