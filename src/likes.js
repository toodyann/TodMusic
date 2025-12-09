const STORAGE_KEY = 'todmusic_likes';

export const getLikes = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveLikes = (likes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
};

export const isLiked = (trackId) => {
    const likes = getLikes();
    return likes.some(t => t.id === trackId);
};

export const addLike = (track) => {
    const likes = getLikes();
    
    if (likes.some(t => t.id === track.id)) {
        throw new Error('Цей трек уже в улюблених');
    }

    likes.push(track);
    saveLikes(likes);
    return likes;
};

export const removeLike = (trackId) => {
    const likes = getLikes();
    const filtered = likes.filter(t => t.id !== trackId);
    saveLikes(filtered);
    return filtered;
};

export const toggleLike = (track) => {
    if (isLiked(track.id)) {
        removeLike(track.id);
        return false;
    } else {
        addLike(track);
        return true;
    }
};


