import { formatDuration } from "./utils.js";
import { isLiked } from "./likes.js";
import { getPlayingTrackId, isPlaying } from "./player.js";

const tracksList = document.getElementById("tracksList");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorSearchTabDiv = document.getElementById("error-search-tab");
const errorPlaylistTabDiv = document.getElementById("error-playlist-tab");
const messageDiv = document.getElementById("message");
let errorMessageTimeout;

export const renderTracks = (tracks) => {
  if (!tracks || tracks.length === 0) {
    tracksList.innerHTML = `
      <div class="no-results">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#FF4C4C" stroke-width="4" fill="rgba(255, 76, 76, 0.1)"/>
          <line x1="20" y1="20" x2="44" y2="44" stroke="#FF4C4C" stroke-width="4" stroke-linecap="round"/>
          <line x1="44" y1="20" x2="20" y2="44" stroke="#FF4C4C" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <p>Немає результатів!</p>
      </div>
    `;
    return;
  }


  tracksList.innerHTML = tracks
    .map((track, index) => {
      const truncateText = (text, maxLength = 20) => {
        if (!text) return "";
        return text.length > maxLength
          ? text.substring(0, maxLength) + "…"
          : text;
      };

      const thumbnail = track.thumbnail
        ? `<img src="${track.thumbnail}" alt="${track.title}" class="track-thumbnail" onerror="this.src='https://via.placeholder.com/60?text=Track'" />`
        : `<div class="track-thumbnail" style="background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">🎵</div>`;

      const playingTrackId = getPlayingTrackId();
      const isCurrentTrackPlaying = playingTrackId === track.id && isPlaying();
      const playButton = track.previewUrl
        ? `<button class="play-btn ${
            isCurrentTrackPlaying ? "playing" : ""
          }" data-track-id="${track.id}" title="${
            isCurrentTrackPlaying ? "Пауза" : "Грати"
          }"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256">
            ${
              isCurrentTrackPlaying
                ? '<path d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z">'
                : '<path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"></path>'
            }
          </svg></button>`
        : `<span class="play-btn disabled" title="Нема попереднього перегляду">-</span>`;

      const liked = isLiked(track.id);
      const likedClass = liked ? "is-liked" : "";
      const preferencesButton = track.previewUrl
        ? `<button class="add-to-preferences-btn ${
            liked ? "liked" : ""
          }" data-track-id="${track.id}" title="${
            liked ? "Видалити з уподобаного" : "Додати в уподобане"
          }">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#ffffff" viewBox="0 0 256 256">
            <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path>
            </svg>
            </button>`
        : "";

      const addToPlaylistBtn = track.previewUrl
        ? `<button class="add-to-playlist-btn" data-track-id="${track.id}" title="Додати в плейліст">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#ffffff" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path></svg>
            </button>`
        : "";

      return `
            <div class="track-item ${likedClass}" data-track-id="${
        track.id
      }" data-track-url="${track.url || ""}" data-preview-url="${
        track.previewUrl || ""
      }" data-track-title="${track.title}" data-track-artist="${
        track.artist
      }" data-track-album="${track.album}" data-track-duration="${
        track.duration
      }" title="${track.title} - ${track.artist}">
                <div class="track-header">
                    <span class="track-number">${index + 1}</span>
                    ${thumbnail}
                    <div class="track-info">
                        <div class="track-details">
                            <div id="song-title" class="track-title">${truncateText(
                              track.title
                            )}</div>
                            <div class="track-artist">${truncateText(
                              track.artist,
                              18
                            )}</div>
                            <div class="track-album" style="font-size: 0.85rem; color: #999; margin-top: 3px;">${truncateText(
                              track.album,
                              18
                            )}</div>
                        </div>
                    </div>
                    <span class="track-duration">${formatDuration(
                      track.duration
                    )}</span>
                    ${playButton}
                    ${preferencesButton}
                    ${addToPlaylistBtn}
                </div>
            </div>
        `;
    })
    .join("");
};

export const clearTracks = () => {
  tracksList.innerHTML = "";
};

export const showLoading = () => {
  loadingSpinner.classList.remove("hidden");
};

export const hideLoading = () => {
  loadingSpinner.classList.add("hidden");
};

export const showError = (message, tab = 'search') => {
  errorSearchTabDiv.classList.add("hidden");
  errorPlaylistTabDiv.classList.add("hidden");

  switch (tab) {
    case 'search':
      errorSearchTabDiv.textContent = message;
      errorSearchTabDiv.classList.remove("hidden");

      errorMessageTimeout = setTimeout(()=>{
        errorSearchTabDiv.classList.add("hidden");
      }, 5000);

      break;
  
    case 'playlist':
      errorPlaylistTabDiv.textContent = message;
      errorPlaylistTabDiv.classList.remove("hidden");
      errorMessageTimeout = setTimeout(()=>{
        errorPlaylistTabDiv.classList.add("hidden");
      }, 5000);
      break;
  
    default:
      break;
  }
};

export const hideError = () => {
  errorSearchTabDiv.classList.add("hidden");
};

export const showMessage = (message) => {
  messageDiv.textContent = message;
  messageDiv.classList.remove("hidden");
};

export const hideMessage = () => {
  messageDiv.classList.add("hidden");
};

window.addEventListener('beforeunload', (event) => {
  console.log(event);
  clearTimeout(errorMessageTimeout);
});