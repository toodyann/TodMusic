import { searchTracks } from './api.js';
import { renderTracks, clearTracks, showLoading, hideLoading, showError, hideError, showMessage, hideMessage } from './ui.js';
import { initPlayer, playTrack } from './player.js';
import { createPlaylist, addTrackToPlaylist } from './playlist.js';
import { renderPlaylists } from './playlist-ui.js';
import { getPlaylists } from './playlist.js';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const newPlaylistName = document.getElementById('newPlaylistName');
const createPlaylistBtn = document.getElementById('createPlaylistBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let currentSearchTracks = [];

document.addEventListener('DOMContentLoaded', () => {
    initPlayer();
    renderPlaylists();
    setupTabs();
});

const setupTabs = () => {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
}

const switchTab = tabName => {
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

const handleSearch = async () => {
    const query = searchInput.value.trim();

    if (!query) {
        showError('Будь ласка, введіть запит для пошуку');
        return;
    }

    hideError();
    showLoading();
    clearTracks();

    try {
        const tracks = await searchTracks(query);
        currentSearchTracks = tracks;
        hideLoading();
        renderTracks(tracks);
        attachPlayButtons(tracks);
        attachAddToPlaylistButtons(tracks);
    } catch (error) {
        hideLoading();
        showError(`Помилка пошуку: ${error.message}`);
        console.error('Search error:', error);
    }
}

const attachPlayButtons = tracks => {
    const trackMap = {};
    tracks.forEach(track => {
        trackMap[track.id] = track;
    });

    document.querySelectorAll('.play-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trackId = btn.dataset.trackId;
            const track = trackMap[trackId];
            if (track && track.previewUrl) {
                playTrack(track);
            }
        });
    });
}

const attachAddToPlaylistButtons = tracks => {
    const trackMap = {};
    tracks.forEach(track => {
        trackMap[track.id] = track;
    });

    document.querySelectorAll('.add-to-playlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trackId = parseInt(btn.dataset.trackId);
            const track = trackMap[trackId];

            if (!track) return;

            const playlists = getPlaylists();

            if (playlists.length === 0) {
                showError('Спочатку створіть плейліст');
                switchTab('playlists');
                return;
            }

            const playlistName = prompt(
                `Виберіть плейліст (${playlists.map(p => p.name).join(', ')}):`,
                playlists[0].name
            );

            if (playlistName) {
                const playlist = playlists.find(p => p.name === playlistName);
                if (playlist) {
                    try {
                        addTrackToPlaylist(playlist.id, track);
                        showMessage('✓ Трек додано в плейліст!');
                        setTimeout(() => hideMessage(), 2000);
                    } catch (err) {
                        showError(err.message);
                    }
                }
            }
        });
    });
}

createPlaylistBtn.addEventListener('click', () => {
    const name = newPlaylistName.value.trim();
    if (!name) {
        showError('Введіть назву плейліста');
        return;
    }

    try {
        createPlaylist(name);
        newPlaylistName.value = '';
        renderPlaylists();
        showMessage('✓ Плейліст створено!');
        setTimeout(() => hideMessage(), 2000);
    } catch (error) {
        showError(error.message);
    }
});

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

newPlaylistName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createPlaylistBtn.click();
    }
});


//animation
window.addEventListener('load', () => {
document.getElementById('page').classList.add('loaded');
});