import axios from "axios";
import { getAccessToken } from "./auth";

const CLIENT_ID = "p0v8uy2o8zlw21vwdhfnqa2s2x3xu2";

export interface Game {
  id: number;
  name: string;
  cover?: {
    id: number;
    url: string;
  };
  rating?: number;
  platforms?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Platform {
  id: number;
  name: string;
}

export interface PlatformGroup {
  groupKey: string;
  ids: number[];
  displayName: string;
  platforms: Platform[];
}

export const PLATFORM_GROUPS: Record<string, number[]> = {
  playstation: [7, 8, 9, 48, 167], // PS1 → PS5
  xbox: [11, 12, 49, 169], // Xbox → Series X|S
  nintendo: [4, 18, 21, 130, 508, 5, 41], // N64, NES, GameCube, Switch...
  sega: [30, 78, 35, 64, 29, 32, 84], // Sega family
  pc: [6, 13, 14, 3], // Windows, DOS, Mac, Linux
  mobile: [39, 34, 73, 74], // iOS, Android
  handheld: [33, 24, 22, 37, 20, 119, 120], // Game Boy → 3DS
};

function groupPlatforms(igdbPlatforms: Platform[]): PlatformGroup[] {
  const groups: PlatformGroup[] = [];

  for (const [groupKey, ids] of Object.entries(PLATFORM_GROUPS)) {
    const matched = igdbPlatforms.filter((p) => ids.includes(p.id));

    if (matched.length > 0) {
      groups.push({
        groupKey,
        ids,
        displayName: groupKey.charAt(0).toUpperCase() + groupKey.slice(1),
        platforms: matched,
      });
    }
  }

  return groups;
}

// FETCH GENRES
export const fetchGenres = async (): Promise<Genre[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token available");

  const response = await axios.post(
    "https://api.igdb.com/v4/genres",
    "fields name, slug; limit 50;",
    {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
    }
  );
  return response.data;
};

// FETCH PLATFORM GROUPS
export const fetchPlatforms = async (): Promise<PlatformGroup[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token available");

  const response = await axios.post(
    "https://api.igdb.com/v4/platforms",
    "fields name, abbreviation, alternative_name, platform_type; limit 300; sort name asc;",
    {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
    }
  );

  return groupPlatforms(response.data);
};

// FETCH GAMES (AGORA ACEITA ARRAY DE PLATAFORMAS E BUSCA POR NOME)
export const fetchGames = async (
  genreId?: number | null,
  platformIds?: number[] | null,
  searchQuery?: string
): Promise<Game[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token available");

  let query = `
    fields name, cover.url, rating, total_rating_count, game_type, platforms;
    sort total_rating_count desc;
    limit 30;
  `;

  const conditions: string[] = [];

  if (genreId) {
    conditions.push(`genres = (${genreId})`);
  }

  if (platformIds && platformIds.length > 0) {
    conditions.push(`platforms = (${platformIds.join(",")})`);
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    // Case insensitive search using IGDB syntax
    conditions.push(`name ~ *"${searchQuery}"*`);
  }

  if (conditions.length > 0) {
    query += `where ${conditions.join(" & ")};`;
  }

  const response = await axios.post("https://api.igdb.com/v4/games", query, {
    headers: {
      "Client-ID": CLIENT_ID,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
  });

  return response.data;
};
