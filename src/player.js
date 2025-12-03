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
    playerPlayBtn.addEventListener('click', () => playerAudio.play());
    playerPauseBtn.addEventListener('click', () => playerAudio.pause());
    
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
