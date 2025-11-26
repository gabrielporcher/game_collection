
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchGames, fetchGenres, Game, Genre } from './services/igdb';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [gamesData, genresData] = await Promise.all([
        fetchGames(),
        fetchGenres()
      ]);
      setGames(gamesData);
      setGenres(genresData);
    } catch (err) {
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadGames = async (genreId?: number | null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGames(genreId || undefined);
      setGames(data);
    } catch (err) {
      setError('Failed to load games.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = (genreId: number) => {
    const newGenre = selectedGenre === genreId ? null : genreId;
    setSelectedGenre(newGenre);
    loadGames(newGenre);
  };

  const renderGenreItem = ({ item }: { item: Genre }) => (
    <TouchableOpacity
      style={[
        styles.genreChip,
        selectedGenre === item.id && styles.genreChipSelected
      ]}
      onPress={() => handleGenreSelect(item.id)}
    >
      <Text style={[
        styles.genreText,
        selectedGenre === item.id && styles.genreTextSelected
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Game }) => (
    <View style={styles.card}>
      {item.cover ? (
        <Image
          source={{ uri: `https:${item.cover.url.replace('t_thumb', 't_cover_big')}` }}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Game List</Text>
      </View>

      <View style={styles.genreContainer}>
        <FlatList
          data={genres}
          renderItem={renderGenreItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genreList}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6441a5" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryButton} onPress={() => loadGames(selectedGenre)}>Retry</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={renderItem}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  genreContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  genreList: {
    paddingHorizontal: 16,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  genreChipSelected: {
    backgroundColor: '#6441a5',
    borderColor: '#6441a5',
  },
  genreText: {
    color: '#333',
    fontWeight: '600',
  },
  genreTextSelected: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cover: {
    width: 100,
    height: 140,
    backgroundColor: '#ddd',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    color: '#6441a5',
    fontWeight: 'bold',
  },
});
