import axios from 'axios';
import { getAccessToken } from './auth';

const CLIENT_ID = 'p0v8uy2o8zlw21vwdhfnqa2s2x3xu2';

export interface Game {
    id: number;
    name: string;
    cover?: {
        id: number;
        url: string;
    };
    rating?: number;
}

export interface Genre {
    id: number;
    name: string;
}

export const fetchGenres = async (): Promise<Genre[]> => {
    const token = await getAccessToken();
    if (!token) {
        throw new Error('No access token available');
    }

    try {
        console.log('Fetching genres from IGDB...');
        const response = await axios.post(
            'https://api.igdb.com/v4/genres',
            'fields name; limit 50;',
            {
                headers: {
                    'Client-ID': CLIENT_ID,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
};

export const fetchGames = async (genreId?: number): Promise<Game[]> => {
    const token = await getAccessToken();
    if (!token) {
        throw new Error('No access token available');
    }

    try {
        console.log(`Fetching games from IGDB (Genre: ${genreId || 'All'})...`);
        let query = 'fields name, cover.url, rating, total_rating_count;sort total_rating_count desc; limit 20;';
        if (genreId) {
            query = query.replace('20;', `20; where genres = (${genreId});`);
        }

        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            query,
            {
                headers: {
                    'Client-ID': CLIENT_ID,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
            }
        );
        console.log('a primeira ok')

        return response.data;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
};
