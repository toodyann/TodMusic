import { isLiked } from './likes.js';

const player = document.getElementById('player');
const playerAudio = document.getElementById('playerAudio');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerPlayBtn = document.getElementById('playerPlayBtn');
const playerProgress = document.getElementById('playerProgress');
const playerTime = document.getElementById('playerTime');
const playerArtworkImg = document.getElementById('playerArtworkImg');
const playerLikeBtn = document.getElementById('playerLikeBtn');
const playerAddToPlaylistBtn = document.getElementById('playerAddToPlaylistBtn');

let currentTrack = null;
let touchStartY = 0;
let currentY = 0;
let isTouching = false;

export const initPlayer = () => {
    playerPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (playerAudio.paused) {
          playerAudio.play();
          playerPlayBtn.classList.add('playing');
          playerPlayBtn.setAttribute('title', 'Пауза');
          playerPlayBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 256 256"><path d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z"></path></svg>
          `;
        } else {
          playerAudio.pause();
          playerPlayBtn.classList.remove('playing');
          playerPlayBtn.setAttribute('title', 'Грати');
          playerPlayBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 256 256"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"></path></svg>
          `;
        }
      });

    const handle = document.getElementById('playerHandle');
    if (handle) {
      handle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.innerWidth <= 768 && !player.classList.contains('fullscreen')) {
          openFullscreen();
        }
      });

    }



    player.addEventListener('touchstart', onTouchStart, {passive: true});
    player.addEventListener('touchmove', onTouchMove, {passive: false});
    player.addEventListener('touchend', onTouchEnd);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && player.classList.contains('fullscreen')) {
        closeFullscreen();
      }
    });

    const playerPrevBtn = document.getElementById('playerPrevBtn');
    const playerNextBtn = document.getElementById('playerNextBtn');
    const playerPlayBtnCenter = document.getElementById('playerPlayBtnCenter');

    if (playerPrevBtn) {
      playerPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        player.dispatchEvent(new CustomEvent('player:prev'));
      });
    }

    if (playerNextBtn) {
      playerNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        player.dispatchEvent(new CustomEvent('player:next'));
      });
    }

    if (playerPlayBtnCenter) {
      playerPlayBtnCenter.addEventListener('click', (e) => {
        e.stopPropagation();
        playerPlayBtn.click();
      });
    }

    // Mobile action buttons
    if (playerLikeBtn) {
      playerLikeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        player.dispatchEvent(new CustomEvent('player:toggleLike'));
      });
    }

    if (playerAddToPlaylistBtn) {
      playerAddToPlaylistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        player.dispatchEvent(new CustomEvent('player:addToPlaylist'));
      });
    }

    const SVG_PLAY = `\n          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"></path></svg>\n        `;
    const SVG_PAUSE = `\n          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256"><path d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z"></path></svg>\n        `;

    const updateCenterPlay = (playing) => {
      if (!playerPlayBtnCenter) return;
      if (playing) {
        playerPlayBtnCenter.classList.add('playing');
        playerPlayBtnCenter.setAttribute('title', 'Пауза');
        playerPlayBtnCenter.innerHTML = SVG_PAUSE;
      } else {
        playerPlayBtnCenter.classList.remove('playing');
        playerPlayBtnCenter.setAttribute('title', 'Грати');
        playerPlayBtnCenter.innerHTML = SVG_PLAY;
      }
    };

    playerAudio.addEventListener('play', () => updateCenterPlay(true));
    playerAudio.addEventListener('pause', () => updateCenterPlay(false));

    playerAudio.addEventListener('timeupdate', updateProgress);
    playerAudio.addEventListener('loadedmetadata', updateDuration);
    playerProgress.addEventListener('change', seekTrack);
    playerProgress.addEventListener('input', seekTrack);
};

const seekTrack = (e) => {
    playerAudio.currentTime = (e.target.value / 100) * playerAudio.duration;
};

const updateProgress = () => {
    const progress = (playerAudio.currentTime / (playerAudio.duration || 1)) * 100;
    playerProgress.value = progress || 0;
    if (playerProgress) {
      const pct = Math.max(0, Math.min(100, progress || 0));
      playerProgress.style.setProperty('--progress', `${pct}%`);
      playerProgress.setAttribute('data-progress', '');
    }
    updateTime();
};

const updateDuration = () => {
    updateTime();
};

const updateTime = () => {
    const current = formatTime(playerAudio.currentTime || 0);
    const duration = formatTime(playerAudio.duration || 0);
    playerTime.textContent = `${current} / ${duration}`;
};

export const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const playTrack = (track) => {
    currentTrack = track;
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    playerAudio.src = track.previewUrl;
    if (playerArtworkImg) {
      playerArtworkImg.src = track.thumbnail || '';
      playerArtworkImg.alt = `${track.title} - ${track.artist}`;
    }
    
    // Update like button state
    updatePlayerLikeButton(isLiked(track.id));
    
    player.classList.remove('hidden');
    playerAudio.play().catch(err => console.log('Play error:', err));
};

export const getCurrentTrack = () => currentTrack;

export const isPlaying = () => !playerAudio.paused && currentTrack !== null;

export const getPlayingTrackId = () => {
    if (isPlaying()) {
        return currentTrack?.id;
    }
    return null;
};

export const onPlaybackStateChange = (callback) => {
    playerAudio.addEventListener('play', callback);
    playerAudio.addEventListener('pause', callback);
};

export const pausePlayer = () => {
    playerAudio.pause();
};

export const stopPlayer = () => {
    playerAudio.pause();
    playerAudio.currentTime = 0;
};

const openFullscreen = () => {
  if (player.classList.contains('fullscreen')) return;

  player.classList.add('fullscreen');
  document.body.classList.add('no-scroll');

  player.style.left = '0';
  player.style.right = '0';
  player.style.width = '100%';
  player.style.maxWidth = 'none';
  player.style.borderRadius = '0';

  player.style.transition = 'none';
  player.style.transform = 'translateX(0) translateY(100%)';

  if (playerProgress) {
    const dur = playerAudio.duration || 0;
    const pct = dur ? ((playerAudio.currentTime || 0) / dur) * 100 : 0;
    playerProgress.style.setProperty('--progress', `${Math.max(0, Math.min(100, pct))}%`);
    playerProgress.setAttribute('data-progress', '');
  }

  player.offsetHeight;

  requestAnimationFrame(() => {
    player.style.transition = 'transform 320ms cubic-bezier(.22, .9, .27, 1)';
    player.style.transform = 'translateX(0) translateY(0)';

    const onEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      player.style.transition = '';
      player.style.transform = 'none';
      player.removeEventListener('transitionend', onEnd);
    };
    player.addEventListener('transitionend', onEnd);
  });
};

const closeFullscreenAnimated = () => {
  if (!player.classList.contains('fullscreen')) return;

  player.style.transition = 'transform 260ms cubic-bezier(.4, 0, .2, 1)';
  player.style.transform = 'translateX(0) translateY(100%)';
  player.classList.remove('dragging');

  const onEnd = (e) => {
    if (e.propertyName !== 'transform') return;
    player.removeEventListener('transitionend', onEnd);
    player.classList.remove('fullscreen');
    document.body.classList.remove('no-scroll');

    player.style.transition = '';
    player.style.transform = '';
    player.style.left = '';
    player.style.right = '';
    player.style.width = '';
    player.style.maxWidth = '';
    player.style.borderRadius = '';
  };

  player.addEventListener('transitionend', onEnd);
};

const closeFullscreen = () => {
  player.classList.remove('fullscreen');
  document.body.classList.remove('no-scroll');
  player.style.transform = '';
  player.style.left = '';
  player.style.right = '';
  player.style.width = '';
  player.style.maxWidth = '';
  player.style.borderRadius = '';
  player.classList.remove('dragging');
};

const onTouchStart = (e) => {
  if (!player.classList.contains('fullscreen')) return;
  const touch = e.touches[0];
  touchStartY = touch.clientY;
  currentY = 0;
  isTouching = true;
};

const onTouchMove = (e) => {
  if (!isTouching) return;
  const touch = e.touches[0];
  const deltaY = touch.clientY - touchStartY;
  if (deltaY > 0) {
    e.preventDefault();
    currentY = deltaY;
    player.style.transform = `translateX(0) translateY(${currentY}px)`;
    player.classList.add('dragging');
  }
};

const onTouchEnd = () => {
  if (!isTouching) return;
  isTouching = false;
  player.classList.remove('dragging');

  const threshold = 120; 
  if (currentY > threshold) {
    closeFullscreen();
  } else {
    player.style.transition = 'transform 200ms ease';
    player.style.transform = '';
    setTimeout(() => {
      player.style.transition = '';
    }, 250);
  }
};

export const updatePlayerLikeButton = (isLiked) => {
  if (playerLikeBtn) {
    if (isLiked) {
      playerLikeBtn.classList.add('liked');
    } else {
      playerLikeBtn.classList.remove('liked');
    }
  }
};
