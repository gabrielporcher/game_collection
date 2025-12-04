import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [error, setError] = useState<string | null>(null);

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

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

  const handleGenreSelect = (genreId: number) => {
    const newGenre = selectedGenre === genreId ? null : genreId;
    setSelectedGenre(newGenre);
    loadGames(newGenre, selectedPlatformGroup, searchQuery);
  };

  const handlePlatformGroupSelect = (groupKey: string) => {
    const newGroup = selectedPlatformGroup === groupKey ? null : groupKey;
    setSelectedPlatformGroup(newGroup);
    loadGames(selectedGenre, newGroup, searchQuery);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setIsFilterExpanded(!isFilterExpanded)}
          style={styles.searchInput}
        />

        {/* EXPANDABLE FILTERS */}
        {isFilterExpanded && (
          <View style={styles.expandedFilters}>
            <Text style={styles.filterSectionTitle}>Platforms</Text>
            <FlatList
              data={platformGroups}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <FilterChip
                  item={item}
                  onPress={() => handlePlatformGroupSelect(item.groupKey)}
                  isSelected={selectedPlatformGroup === item.groupKey}
                />
              )}
              keyExtractor={(item) => item.groupKey}
              contentContainerStyle={styles.filterList}
              style={styles.filterListContainer}
            />

            <Text style={styles.filterSectionTitle}>Genres</Text>
            <FlatList
              data={genres}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <FilterChip
                  item={item}
                  onPress={() => handleGenreSelect(item.id)}
                  isSelected={selectedGenre === item.id}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.filterList}
              style={styles.filterListContainer}
            />
          </View>
        )}
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
            <GameCard game={item} onPress={() => console.log(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
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
  headerTitle: {
    fontSize: Typography.size.xl,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: Spacing.md,
    textAlign: "center",
    letterSpacing: 1,
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
});
