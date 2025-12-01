import { searchTracks } from './api.js';
import { renderTracks, clearTracks, showLoading, hideLoading, showError, hideError, showMessage, hideMessage } from './ui.js';
import { initPlayer, playTrack, pausePlayer, onPlaybackStateChange, getPlayingTrackId, isPlaying } from './player.js';
import { createPlaylist, addTrackToPlaylist } from './playlist.js';
import { renderPlaylists } from './playlist-ui.js';
import { getPlaylists } from './playlist.js';
import { toggleLike, isLiked } from './likes.js';
import { renderLikes } from './likes-ui.js';

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
    renderPreferences();
    setupTabs();
    
    onPlaybackStateChange(() => {
        if (currentSearchTracks.length > 0) {
            renderTracks(currentSearchTracks);
            attachPlayButtons(currentSearchTracks);
            attachAddToPlaylistButtons(currentSearchTracks);
            attachPreferencesButtons(currentSearchTracks);
        }
    });
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
        attachPreferencesButtons(tracks);
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
            const trackId = parseInt(btn.dataset.trackId);
            const track = trackMap[trackId];
            
            if (!track || !track.previewUrl) return;
            
            const playingTrackId = getPlayingTrackId();
            
            if (playingTrackId === trackId && isPlaying()) {
                pausePlayer();
            } else {
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

            showPlaylistSelector(playlists, track);
        });
    });
};

const showPlaylistSelector = (playlists, track) => {
    const options = playlists.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    
    const html = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;" id="playlistSelectorModal">
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 400px; width: 90%;">
                <h3 style="margin-bottom: 15px; color: #333;">Виберіть плейліст для додавання</h3>
                <p style="margin-bottom: 10px; color: #666; font-size: 0.9rem;"><strong>${track.title}</strong> - ${track.artist}</p>
                <select id="playlistSelect" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem; margin-bottom: 15px;">
                    ${options}
                </select>
                <div style="display: flex; gap: 10px;">
                    <button id="cancelBtn" style="flex: 1; padding: 10px; background: #ddd; border: none; border-radius: 5px; cursor: pointer;">Скасувати</button>
                    <button id="addBtn" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">Додати</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    const modal = document.getElementById('playlistSelectorModal');
    const select = document.getElementById('playlistSelect');
    const addBtn = document.getElementById('addBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    const closeModal = () => modal.remove();

    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    addBtn.addEventListener('click', () => {
        const playlistId = parseInt(select.value);
        const playlist = playlists.find(p => p.id === playlistId);
        
        if (playlist) {
            try {
                addTrackToPlaylist(playlistId, track);
                showMessage(`✓ Трек додано в "${playlist.name}"!`);
                setTimeout(() => hideMessage(), 2000);
                closeModal();
                renderPlaylists();
            } catch (err) {
                showError(err.message);
            }
        }
    });
};

const attachPreferencesButtons = tracks => {
    const trackMap = {};
    tracks.forEach(track => {
        trackMap[track.id] = track;
    });

    document.querySelectorAll('.add-to-preferences-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trackId = parseInt(btn.dataset.trackId);
            const track = trackMap[trackId];

            if (!track) return;

            const liked = toggleLike(track);
            const trackItem = btn.closest('.track-item');
            
            if (liked) {
                btn.classList.add('liked');
                trackItem.classList.add('is-liked');
            } else {
                btn.classList.remove('liked');
                trackItem.classList.remove('is-liked');
            }
            
            renderPreferences();
        });
    });
};

const renderPreferences = () => {
    renderLikes();
};

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


if ('ontouchstart' in document.documentElement) {
    const style = document.createElement('style');
    style.innerHTML = '.faq-item:hover { background: none !important; }';
    document.head.appendChild(style);
}

window.addEventListener('load', () => {
document.getElementById('page').classList.add('loaded');
});