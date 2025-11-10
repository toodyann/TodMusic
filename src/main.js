import { searchTracks } from './api.js';
import { renderTracks, clearTracks, showLoading, hideLoading, showError, hideError } from './ui.js';
import { initPlayer, playTrack } from './player.js';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

document.addEventListener('DOMContentLoaded', () => {
    initPlayer();
});

async function handleSearch() {
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
        hideLoading();
        renderTracks(tracks);
        attachPlayButtons(tracks);
    } catch (error) {
        hideLoading();
        showError(`Помилка пошуку: ${error.message}`);
        console.error('Search error:', error);
    }
}

// Attach play button listeners
function attachPlayButtons(tracks) {
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

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
