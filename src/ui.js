import { formatDuration } from './utils.js';

const tracksList = document.getElementById('tracksList');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorDiv = document.getElementById('error');

export const renderTracks = tracks => {
    if (!tracks || tracks.length === 0) {
        tracksList.innerHTML = '<p class="no-results">Немає результатів(</p>';
        return;
    }

    tracksList.innerHTML = tracks.map((track, index) => {
        const thumbnail = track.thumbnail 
            ? `<img src="${track.thumbnail}" alt="${track.title}" class="track-thumbnail" onerror="this.src='https://via.placeholder.com/60?text=Track'" />`
            : `<div class="track-thumbnail" style="background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">🎵</div>`;
        
        const audioPlayer = track.previewUrl 
            ? `<audio controls class="track-audio">
                <source src="${track.previewUrl}" type="audio/mpeg">
                Твій браузер не підтримує елемент audio.
              </audio>`
            : '<p class="no-preview">🎵 Прев' + 'ю не доступно</p>';
        
        return `
            <div class="track-item" data-track-id="${track.id}" data-track-url="${track.url || ''}" data-preview-url="${track.previewUrl || ''}" title="${track.title} - ${track.artist}">
                <div class="track-header">
                    <span class="track-number">${index + 1}</span>
                    ${thumbnail}
                    <div class="track-info">
                        <div class="track-details">
                            <div class="track-title">${track.title}</div>
                            <div class="track-artist">${track.artist}</div>
                            <div class="track-album" style="font-size: 0.85rem; color: #999; margin-top: 3px;">${track.album}</div>
                        </div>
                    </div>
                    <span class="track-duration">${formatDuration(track.duration)}</span>
                </div>
                <div class="track-player">
                    ${audioPlayer}
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.track-item').forEach(item => {
        const audio = item.querySelector('.track-audio');
        if (audio) {
            audio.addEventListener('play', () => {
                document.querySelectorAll('.track-audio').forEach(otherAudio => {
                    if (otherAudio !== audio) {
                        otherAudio.pause();
                    }
                });
            });
        }
    });
}

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