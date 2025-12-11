import { getLikes, removeLike } from './likes.js';
import { formatDuration } from './utils.js';
import { playTrack, pausePlayer, getPlayingTrackId, isPlaying } from './player.js';

const likesList = document.getElementById('tracksListPreferences');

export const renderLikes = () => {
    const likes = getLikes();

    if (likes.length === 0) {
        likesList.innerHTML = '<p class="placeholder">Немає уподобаних пісень. Додайте перший! 💛</p>';
        return;
    }

    likesList.innerHTML = `
        <div class="likes-container">
            ${likes.map((track, idx) => `
                <div class="likes-track-item" data-track-id="${track.id}">
                    <div class="likes-track-content">
                        <span class="likes-track-num">${idx + 1}</span>
                        <img src="${track.thumbnail}" alt="${track.title}" class="track-thumbnail" onerror="this.src='https://via.placeholder.com/60?text=Track'" />
                        <div class="likes-track-info">
                            <div class="likes-track-title">${track.title}</div>
                            <div class="likes-track-artist">${track.artist}</div>
                            <div class="likes-track-album">${track.album || 'Unknown Album'}</div>
                        </div>
                    </div>
                    <div class="likes-track-actions">

                        <span class="likes-track-duration">${formatDuration(track.duration)}</span>

                        <button class="play-liked-btn" data-track-id="${track.id}" title="Запустити">

                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256">
                        <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z">
                        </path>
                        </svg>

                        </button>

                        <button class="remove-liked-btn" data-track-id="${track.id}" title="Видалити з уподобаного">

                        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#ffffff" viewBox="0 0 256 256">
                        <path d="M178,40a61.6,61.6,0,0,0-43.84,18.16L128,64.32l-6.16-6.16A62,62,0,0,0,16,102c0,70,103.79,126.67,108.21,129a8,8,0,0,0,7.58,0C136.21,228.67,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102a46,46,0,0,1,78.53-32.53l6.16,6.16L106.34,86a8,8,0,0,0,0,11.31l24.53,24.53-16.53,16.52a8,8,0,0,0,11.32,11.32l22.18-22.19a8,8,0,0,0,0-11.31L123.31,91.63l22.16-22.16A46,46,0,0,1,224,102C224,155.61,146.24,204.15,128,214.8Z">
                        </path>
                        </svg>

                      </button>

                    </div>
                </div>
            `).join('')}
        </div>
    `;

    attachLikesEventListeners(likes);
};

const attachLikesEventListeners = (likes) => {
    document.querySelectorAll('.play-liked-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trackId = parseInt(btn.dataset.trackId);
            const track = likes.find(t => t.id === trackId);
            
            if (!track) return;
            
            const playingTrackId = getPlayingTrackId();
            
            if (playingTrackId === trackId && isPlaying()) {
                pausePlayer();
            } else {
                playTrack(track);
            }
        });
    });

    document.querySelectorAll('.remove-liked-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trackId = parseInt(btn.dataset.trackId);
            removeLike(trackId);
            renderLikes();
        });
    });
};

export const clearLikesUI = () => {
    likesList.innerHTML = '';
};


