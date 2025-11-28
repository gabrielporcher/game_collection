import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";

import {
  fetchGames,
  fetchGenres,
  fetchPlatforms,
  Game,
  Genre,
  PlatformGroup,
} from "@/src/services/igdb";

type FilterType = "GENRE" | "PLATFORM";

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platformGroups, setPlatformGroups] = useState<PlatformGroup[]>([]);

  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedPlatformGroup, setSelectedPlatformGroup] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilterType, setActiveFilterType] = useState<FilterType>("GENRE");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // INITIAL LOAD
  useEffect(() => {
    loadInitial();
  }, []);

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only load if we are not in the initial loading state (or if we have data)
      if (!loading || games.length > 0) {
        loadGames(selectedGenre, selectedPlatformGroup, searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadInitial = async () => {
    try {
      setLoading(true);
      const [gamesData, genresData, platformsData] = await Promise.all([
        fetchGames(),
        fetchGenres(),
        fetchPlatforms(),
      ]);
      setGames(gamesData);
      setGenres(genresData);
      setPlatformGroups(platformsData);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const loadGames = async (
    genreId?: number | null,
    platformGroupKey?: string | null,
    query?: string
  ) => {
    try {
      setLoading(true);

      const platformIds = platformGroupKey
        ? platformGroups.find((g) => g.groupKey === platformGroupKey)?.ids || []
        : [];

      const data = await fetchGames(
        genreId !== undefined ? genreId : selectedGenre,
        platformGroupKey !== undefined
          ? platformIds
          : selectedPlatformGroup
          ? platformGroups.find((g) => g.groupKey === selectedPlatformGroup)
              ?.ids || []
          : [],
        query !== undefined ? query : searchQuery
      );

      setGames(data);
    } catch {
      setError("Failed to load games.");
    } finally {
      setLoading(false);
    }
  };

  // GENRE FILTER
  const handleGenreSelect = (genreId: number) => {
    const newGenre = selectedGenre === genreId ? null : genreId;
    setSelectedGenre(newGenre);
    loadGames(newGenre, selectedPlatformGroup, searchQuery);
  };

  // PLATFORM GROUP FILTER
  const handlePlatformGroupSelect = (groupKey: string) => {
    const newGroup = selectedPlatformGroup === groupKey ? null : groupKey;
    setSelectedPlatformGroup(newGroup);
    loadGames(selectedGenre, newGroup, searchQuery);
  };

  const renderGenreItem = ({ item }: { item: Genre }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedGenre === item.id && styles.filterChipSelected,
      ]}
      onPress={() => handleGenreSelect(item.id)}
    >
      <Text
        style={[
          styles.filterText,
          selectedGenre === item.id && styles.filterTextSelected,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPlatformGroupItem = ({ item }: { item: PlatformGroup }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedPlatformGroup === item.groupKey && styles.filterChipSelected,
      ]}
      onPress={() => handlePlatformGroupSelect(item.groupKey)}
    >
      <Text
        style={[
          styles.filterText,
          selectedPlatformGroup === item.groupKey && styles.filterTextSelected,
        ]}
      >
        {item.displayName}
      </Text>
    </TouchableOpacity>
  );

  const renderGame = ({ item }: { item: Game }) => (
    <TouchableOpacity style={styles.card}>
      {item.cover ? (
        <Image
          source={{
            uri: `https:${item.cover.url.replace("t_thumb", "t_cover_big")}`,
          }}
          style={styles.cover}
        />
      ) : (
        <View style={[styles.cover, styles.placeholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        {item.rating && (
          <Text style={styles.rating}>Rating: {Math.round(item.rating)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Game List</Text>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterTypeContainer}>
        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            activeFilterType === "GENRE" && styles.filterTypeButtonActive,
          ]}
          onPress={() => setActiveFilterType("GENRE")}
        >
          <Text
            style={[
              styles.filterTypeText,
              activeFilterType === "GENRE" && styles.filterTypeTextActive,
            ]}
          >
            Genres
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            activeFilterType === "PLATFORM" && styles.filterTypeButtonActive,
          ]}
          onPress={() => setActiveFilterType("PLATFORM")}
        >
          <Text
            style={[
              styles.filterTypeText,
              activeFilterType === "PLATFORM" && styles.filterTypeTextActive,
            ]}
          >
            Platforms
          </Text>
        </TouchableOpacity>
      </View>

      {/* FILTER LIST */}
      <View style={styles.filterListContainer}>
        {activeFilterType === "GENRE" && (
          <FlatList
            data={genres}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderGenreItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.filterList}
          />
        )}

        {activeFilterType === "PLATFORM" && (
          <FlatList
            data={platformGroups}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderPlatformGroupItem}
            keyExtractor={(item) => item.groupKey}
            contentContainerStyle={styles.filterList}
          />
        )}
      </View>

      {/* GAME LIST */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6441a5" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={renderGame}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  searchContainer: {
    paddingHorizontal: 0,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  filterTypeContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  filterTypeButton: {
    marginRight: 20,
    paddingBottom: 10,
  },
  filterTypeButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#6441a5",
  },
  filterTypeText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  filterTypeTextActive: {
    color: "#6441a5",
  },
  filterListContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    height: 60,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterChipSelected: {
    backgroundColor: "#6441a5",
    borderColor: "#6441a5",
  },
  filterText: {
    color: "#333",
    fontWeight: "600",
  },
  filterTextSelected: {
    color: "#fff",
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cover: {
    width: 100,
    height: 140,
    backgroundColor: "#ddd",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  rating: {
    fontSize: 14,
    color: "#666",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  retryButton: {
    color: "#6441a5",
    fontWeight: "bold",
  },
});
