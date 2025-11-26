import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const CLIENT_ID = 'p0v8uy2o8zlw21vwdhfnqa2s2x3xu2';
const CLIENT_SECRET = '6dqhiigm6j5a6ewvqeg76wl0qerpog'; // WARNING: Storing client secret in app is insecure
const TOKEN_KEY = 'twitch_access_token';
const EXPIRY_KEY = 'twitch_token_expiry';

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export const getAccessToken = async (): Promise<string | null> => {
  try {
    // 1. Check local storage
    const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
    const storedExpiry = await SecureStore.getItemAsync(EXPIRY_KEY);

    if (storedToken && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const currentTime = Date.now();

      // Buffer of 60 seconds
      if (currentTime < expiryTime - 60000) {
        console.log('Using stored token');
        return storedToken;
      }
    }

    // 2. Request new token
    console.log('Requesting new token...');
    const response = await axios.post<TwitchTokenResponse>(
      'https://id.twitch.tv/oauth2/token',
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'client_credentials',
        },
      }
    );

    const { access_token, expires_in } = response.data;
    const newExpiry = Date.now() + expires_in * 1000;

    // 3. Store token
    await SecureStore.setItemAsync(TOKEN_KEY, access_token);
    await SecureStore.setItemAsync(EXPIRY_KEY, newExpiry.toString());

    return access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const clearToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(EXPIRY_KEY);
};
