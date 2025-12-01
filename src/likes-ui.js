// Likes UI rendering

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
                        <div class="likes-track-thumbnail" style="background: linear-gradient(135deg, #FFD700, #FFA500); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; border-radius: 5px;">💛</div>
                        <div class="likes-track-info">
                            <div class="likes-track-title">${track.title}</div>
                            <div class="likes-track-artist">${track.artist}</div>
                            <div class="likes-track-album">${track.album || 'Unknown Album'}</div>
                        </div>
                    </div>
                    <div class="likes-track-actions">
                        <span class="likes-track-duration">${formatDuration(track.duration)}</span>
                        <button class="play-liked-btn" data-track-id="${track.id}" title="Запустити">▶</button>
                        <button class="remove-liked-btn" data-track-id="${track.id}" title="Видалити з уподобаного"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                      </svg></button>
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


