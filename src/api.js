import axios from 'axios';

const ITUNES_API = 'https://itunes.apple.com/search';

export const searchTracks = async (query) => {
    try {
        if (!query || query.trim().length === 0) {
            throw new Error('Search query cannot be empty');
        }

        const response = await axios.get(ITUNES_API, {
            params: {
                term: query,
                media: 'music',
                entity: 'song',
                limit: 30,
                country: 'US'
            },
            timeout: 10000
        });

        if (!response.data || !response.data.results || response.data.results.length === 0) {
            return [];
        }

        return response.data.results.map((track) => ({
            id: track.trackId,
            title: track.trackName || 'Unknown Track',
            artist: track.artistName || 'Unknown Artist',
            album: track.collectionName || 'Unknown Album',
            duration: Math.floor((track.trackTimeMillis || 0) / 1000),
            thumbnail: track.artworkUrl100 || track.artworkUrl60 || null,
            url: track.trackViewUrl || null,
            previewUrl: track.previewUrl || null,
            releaseDate: track.releaseDate || null
        }));
    } catch (error) {
        console.error('iTunes API Error:', error.message);
        throw new Error(`Failed to search tracks: ${error.message}`);
    }
}
