const player = document.getElementById('player');
const playerAudio = document.getElementById('playerAudio');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerPlayBtn = document.getElementById('playerPlayBtn');
const playerProgress = document.getElementById('playerProgress');
const playerTime = document.getElementById('playerTime');
const playerArtworkImg = document.getElementById('playerArtworkImg');

let currentTrack = null;
let touchStartY = 0;
let currentY = 0;
let isTouching = false;

export const initPlayer = () => {
    // Play / Pause
    playerPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (playerAudio.paused) {
          playerAudio.play();
          playerPlayBtn.classList.add('playing');
          playerPlayBtn.setAttribute('title', 'Пауза');
          playerPlayBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256"><path d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z"></path></svg>
          `;
        } else {
          playerAudio.pause();
          playerPlayBtn.classList.remove('playing');
          playerPlayBtn.setAttribute('title', 'Грати');
          playerPlayBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"></path></svg>
          `;
        }
      });

    // Fullscreen open on handle click (only on mobile)
    const handle = document.getElementById('playerHandle');
    if (handle) {
      handle.addEventListener('click', (e) => {
        e.stopPropagation();
        // Only open fullscreen on smaller viewports (mobile)
        if (window.innerWidth <= 768 && !player.classList.contains('fullscreen')) {
          openFullscreen();
        }
      });

      // Also allow double-click on desktop to open (optional) - no-op by default
    }



    // Touch handlers for swipe-down to close
    player.addEventListener('touchstart', onTouchStart, {passive: true});
    player.addEventListener('touchmove', onTouchMove, {passive: false});
    player.addEventListener('touchend', onTouchEnd);

    // Keyboard Esc to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && player.classList.contains('fullscreen')) {
        closeFullscreen();
      }
    });

    // Prev / Next and center play button wiring
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
        // reuse existing top-left play button logic
        playerPlayBtn.click();
      });
    }

    // Keep center play button in sync with actual playback state
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
    // set CSS variable for styled filled track in fullscreen
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

// Fullscreen control functions
const openFullscreen = () => {
  if (player.classList.contains('fullscreen')) return;

  // add class and block page scroll
  player.classList.add('fullscreen');
  document.body.classList.add('no-scroll');

  // prepare styles so we can animate from bottom -> up
  player.style.left = '0';
  player.style.right = '0';
  player.style.width = '100%';
  player.style.maxWidth = 'none';
  player.style.borderRadius = '0';

  // set starting transform (below the viewport)
  player.style.transition = 'none';
  player.style.transform = 'translateX(0) translateY(100%)';

  // ensure progress bar is visible/initialised
  if (playerProgress) {
    // if audio has duration, set real percent, otherwise 0
    const dur = playerAudio.duration || 0;
    const pct = dur ? ((playerAudio.currentTime || 0) / dur) * 100 : 0;
    playerProgress.style.setProperty('--progress', `${Math.max(0, Math.min(100, pct))}%`);
    playerProgress.setAttribute('data-progress', '');
  }

  // force reflow so the initial transform is applied
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  player.offsetHeight;

  // animate to visible position
  requestAnimationFrame(() => {
    player.style.transition = 'transform 320ms cubic-bezier(.22, .9, .27, 1)';
    player.style.transform = 'translateX(0) translateY(0)';

    // cleanup after animation
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

  // animate down
  player.style.transition = 'transform 260ms cubic-bezier(.4, 0, .2, 1)';
  player.style.transform = 'translateX(0) translateY(100%)';
  player.classList.remove('dragging');

  const onEnd = (e) => {
    if (e.propertyName !== 'transform') return;
    player.removeEventListener('transitionend', onEnd);
    // finalize close
    player.classList.remove('fullscreen');
    document.body.classList.remove('no-scroll');

    // clear inline styles to restore compact layout
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
  // immediate close without animation (fallback)
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

// Touch handling
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
    player.style.transform = `translateY(${currentY}px)`;
    player.classList.add('dragging');
  }
};

const onTouchEnd = () => {
  if (!isTouching) return;
  isTouching = false;
  player.classList.remove('dragging');

  const threshold = 120; // px
  if (currentY > threshold) {
    closeFullscreen();
  } else {
    // snap back
    player.style.transition = 'transform 200ms ease';
    player.style.transform = '';
    setTimeout(() => {
      player.style.transition = '';
    }, 250);
  }
};
