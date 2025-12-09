const player = document.getElementById('player');
const playerAudio = document.getElementById('playerAudio');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerPlayBtn = document.getElementById('playerPlayBtn');
const playerPauseBtn = document.getElementById('playerPauseBtn');
const playerProgress = document.getElementById('playerProgress');
const playerTime = document.getElementById('playerTime');

let currentTrack = null;

export const initPlayer = () => {
    playerPlayBtn.addEventListener('click', () => {
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
    
    playerAudio.addEventListener('timeupdate', updateProgress);
    playerAudio.addEventListener('loadedmetadata', updateDuration);
    playerProgress.addEventListener('change', seekTrack);
    playerProgress.addEventListener('input', seekTrack);
};

const seekTrack = (e) => {
    playerAudio.currentTime = (e.target.value / 100) * playerAudio.duration;
};

const updateProgress = () => {
    const progress = (playerAudio.currentTime / playerAudio.duration) * 100;
    playerProgress.value = progress || 0;
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
