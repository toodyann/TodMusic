import { searchTracks } from './api.js';
import { renderTracks, clearTracks, showLoading, hideLoading, showError, hideError } from './ui.js';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const handleSearch = async () => {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Введіть пошуковий запит.');
        return;
    }

    hideError();
    showLoading();
    clearTracks();

    try {
        const tracks = await searchTracks(query);
        hideLoading();
        renderTracks(tracks);
    } catch (error) {
        hideLoading();
        showError(`Помилка: ${error.message}`);
        console.error('Search error:', error);
    }
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

