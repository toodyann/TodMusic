import axios from 'axios';

const ITUNES_API = 'https://itunes.apple.com/search';

export const searchTracks = async (query, genreId = null, genreName = null) => {
    try {
        if (!query || query.trim().length === 0) {
            throw new Error('Search query cannot be empty');
        }

        const params = {
            term: query,
            media: 'music',
            entity: 'song',
            limit: 30,
            country: 'US'
        };

        const response = await axios.get(ITUNES_API, {
            params,
            timeout: 10000
        });

        if (!response.data || !response.data.results || response.data.results.length === 0) {
            return [];
        }

        let results = response.data.results.map((track) => ({
            id: track.trackId,
            title: track.trackName || 'Unknown Track',
            artist: track.artistName || 'Unknown Artist',
            album: track.collectionName || 'Unknown Album',
            genre: track.primaryGenreName || 'Unknown Genre',
            duration: Math.floor((track.trackTimeMillis || 0) / 1000),
            thumbnail: track.artworkUrl100 || track.artworkUrl60 || null,
            url: track.trackViewUrl || null,
            previewUrl: track.previewUrl || null,
            releaseDate: track.releaseDate || null
        }));

        // Filter by genre name if specified
        if (genreName) {
            results = results.filter(track => 
                track.genre.toLowerCase() === genreName.toLowerCase()
            );
        }

        return results;
    } catch (error) {
        console.error('iTunes API Error:', error.message);
        throw new Error(`Failed to search tracks: ${error.message}`);
    }
}
