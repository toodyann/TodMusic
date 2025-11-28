import { formatDuration } from './utils.js';

const tracksList = document.getElementById('tracksList');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorDiv = document.getElementById('error');
const messageDiv = document.getElementById('message');

export const renderTracks = tracks => {
    if (!tracks || tracks.length === 0) {
        tracksList.innerHTML = '<p class="no-results">Немає результатів!</p> <img src=././404_Error.svg>';
        return;
    }

    tracksList.innerHTML = tracks.map((track, index) => {
        const truncateText = (text, maxLength = 20) => {
            if (!text) return '';
            return text.length > maxLength ? text.substring(0, maxLength) + '…' : text;
        };

        const thumbnail = track.thumbnail 
            ? `<img src="${track.thumbnail}" alt="${track.title}" class="track-thumbnail" onerror="this.src='https://via.placeholder.com/60?text=Track'" />`
            : `<div class="track-thumbnail" style="background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">🎵</div>`;
        
        const playButton = track.previewUrl 
            ? `<button class="play-btn" data-track-id="${track.id}" title="Грати"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
          </svg></button>`
            : `<span class="play-btn disabled" title="Нема попереднього перегляду">-</span>`;
        
            const preferencesButton = track.previewUrl 
            ? `<button class="add-to-preferences-btn" data-track-id="${track.id}" title="Уподобати"><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
          </svg></button>`
            : '';
        
        const addToPlaylistBtn = track.previewUrl
            ? `<button class="add-to-playlist-btn" data-track-id="${track.id}" title="Додати в плейліст"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
          </svg></button>`
            : '';
        
        return `
            <div class="track-item" data-track-id="${track.id}" data-track-url="${track.url || ''}" data-preview-url="${track.previewUrl || ''}" data-track-title="${track.title}" data-track-artist="${track.artist}" data-track-album="${track.album}" data-track-duration="${track.duration}" title="${track.title} - ${track.artist}">
                <div class="track-header">
                    <span class="track-number">${index + 1}</span>
                    ${thumbnail}
                    <div class="track-info">
                        <div class="track-details">
                            <div id="song-title" class="track-title">${truncateText(track.title)}</div>
                            <div class="track-artist">${truncateText(track.artist, 18)}</div>
                            <div class="track-album" style="font-size: 0.85rem; color: #999; margin-top: 3px;">${truncateText(track.album, 18)}</div>
                        </div>
                    </div>
                    <span class="track-duration">${formatDuration(track.duration)}</span>
                    ${playButton}
                    ${preferencesButton}
                    ${addToPlaylistBtn}
                </div>
            </div>
        `;
    }).join('');
};


export const clearTracks = () => {
    tracksList.innerHTML = '';
}

export const showLoading = () => {
    loadingSpinner.classList.remove('hidden');
}

export const hideLoading = () => {
    loadingSpinner.classList.add('hidden');
}

export const showError = (message) => {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

export const hideError = () => {
    errorDiv.classList.add('hidden');
}

export const showMessage = (message) => {
    messageDiv.textContent = message;
    messageDiv.classList.remove('hidden');
}

export const hideMessage = () => {
    messageDiv.classList.add('hidden');
}