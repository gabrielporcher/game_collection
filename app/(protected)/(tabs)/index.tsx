import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  fetchGames,
  fetchGenres,
  fetchPlatforms,
  Game,
  Genre,
  PlatformGroup,
} from "@/src/services/igdb";
import { SearchInput } from "@/src/components/SearchInput";
import { GameCard } from "@/src/components/GameCard";
import { Colors } from "@/src/constants/Colors";
import { Spacing, Typography, BorderRadius } from "@/src/constants/Theme";
import { FilterChip } from "@/src/components/FilterChip";

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platformGroups, setPlatformGroups] = useState<PlatformGroup[]>([]);

  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedPlatformGroup, setSelectedPlatformGroup] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const router = useRouter();

  // INITIAL LOAD
  useEffect(() => {
    loadInitial();
  }, []);

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only load if we are not in the initial loading state (or if we have data)
      if (!loading || games.length > 0) {
        loadGames(selectedGenre, selectedPlatformGroup, searchQuery, true);
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
      setOffset(20); // Initialize offset for next page
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const loadGames = async (
    genreId?: number | null,
    platformGroupKey?: string | null,
    query?: string,
    reset: boolean = false
  ) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      const limit = 20;

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
        query !== undefined ? query : searchQuery,
        limit,
        currentOffset
      );

      if (data.length < limit) {
        setHasMore(false);
      }

      if (reset) {
        setGames(data);
      } else {
        setGames((prev) => [...prev, ...data]);
      }

      setOffset(currentOffset + limit);
    } catch {
      setError("Failed to load games.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      loadGames(selectedGenre, selectedPlatformGroup, searchQuery, false);
    }
  };

  const handleGenreSelect = (genreId: number) => {
    const newGenre = selectedGenre === genreId ? null : genreId;
    setSelectedGenre(newGenre);
    loadGames(newGenre, selectedPlatformGroup, searchQuery, true);
  };

  const handlePlatformGroupSelect = (groupKey: string) => {
    const newGroup = selectedPlatformGroup === groupKey ? null : groupKey;
    setSelectedPlatformGroup(newGroup);
    loadGames(selectedGenre, newGroup, searchQuery, true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setIsFilterExpanded(!isFilterExpanded)}
          isFilterExpanded={isFilterExpanded}
          platformGroups={platformGroups}
          genres={genres}
          onPlatformPress={(key) => handlePlatformGroupSelect(key)}
          onGenrePress={(id) => handleGenreSelect(id)}
          selectedPlatformGroup={selectedPlatformGroup}
          selectedGenre={selectedGenre}
          style={styles.searchInput}
        />
      </View>

      {/* GAME LIST */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : error && games.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={({ item }) => (
            <GameCard
              game={item}
              onPress={() =>
                router.navigate({
                  pathname: "/Game",
                  params: {
                    id: item.id,
                    name: item.name,
                    cover: item.cover?.url,
                    rating: item.rating,
                    summary: item.summary,
                    storyline: item.storyline,
                    platforms: item.platforms,
                    genres: item.genres,
                    multiplayer_modes: item.multiplayer_modes,
                  },
                })
              }
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.dark.primary} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: Spacing.md,
    backgroundColor: Colors.dark.background,
    zIndex: 1,
  },

  searchInput: {
    marginBottom: Spacing.sm,
  },
  expandedFilters: {
    marginTop: Spacing.sm,
  },
  filterSectionTitle: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  filterListContainer: {
    marginBottom: Spacing.xs,
  },
  filterList: {
    paddingRight: Spacing.md,
  },
  list: {
    padding: Spacing.md,
    paddingTop: 0,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Colors.dark.textSecondary,
  },
  errorText: {
    color: "red",
    marginBottom: Spacing.sm,
  },
  footerLoader: {
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
});
