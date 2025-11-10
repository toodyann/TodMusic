const STORAGE_KEY = 'todmusic_playlists';

export const getPlaylists = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const savePlaylists = (playlists) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
};

export const createPlaylist = (name) => {
    if (!name || name.trim() === '') {
        throw new Error('Назва плейліста не може бути порожньою');
    }

    const playlists = getPlaylists();
    
    const newPlaylist = {
        id: Date.now(),
        name: name.trim(),
        tracks: [],
        createdAt: new Date().toISOString()
    };

    playlists.push(newPlaylist);
    savePlaylists(playlists);
    return newPlaylist;
};

export const deletePlaylist = (playlistId) => {
    const playlists = getPlaylists();
    const filtered = playlists.filter(p => p.id !== playlistId);
    savePlaylists(filtered);
};

export const addTrackToPlaylist = (playlistId, track) => {
    const playlists = getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (!playlist) {
        throw new Error('Плейліст не знайдено');
    }

    if (playlist.tracks.some(t => t.id === track.id)) {
        throw new Error('Цей трек вже в плейлісті');
    }

    playlist.tracks.push(track);
    savePlaylists(playlists);
    return playlist;
};

export const removeTrackFromPlaylist = (playlistId, trackId) => {
    const playlists = getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (!playlist) {
        throw new Error('Плейліст не знайдено');
    }

    playlist.tracks = playlist.tracks.filter(t => t.id !== trackId);
    savePlaylists(playlists);
    return playlist;
};

export const getPlaylist = (playlistId) => {
    const playlists = getPlaylists();
    return playlists.find(p => p.id === playlistId);
};
