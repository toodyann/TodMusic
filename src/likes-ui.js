// Likes UI rendering

import { getLikes, removeLike } from './likes.js';
import { formatDuration } from './utils.js';
import { playTrack } from './player.js';

const likesList = document.getElementById('likesList');

export const renderLikes = () => {
    const likes = getLikes();

    if (likes.length === 0) {
        likesList.innerHTML = '<p class="placeholder">Немає улюблених треків. Додайте перший! ❤️</p>';
        return;
    }

    likesList.innerHTML = `
        <div class="likes-container">
            ${likes.map((track, idx) => `
                <div class="likes-track-item">
                    <span class="likes-track-num">${idx + 1}</span>
                    <div class="likes-track-info">
                        <div class="likes-track-title">${track.title}</div>
                        <div class="likes-track-artist">${track.artist}</div>
                    </div>
                    <span class="likes-track-duration">${formatDuration(track.duration)}</span>
                    <button class="play-liked-btn" data-track-id="${track.id}" title="Запустити">▶</button>
                    <button class="remove-liked-btn" data-track-id="${track.id}" title="Видалити з улюблених">❌</button>
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
            if (track) {
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

