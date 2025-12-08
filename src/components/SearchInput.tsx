import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Text,
  FlatList,
} from "react-native";
import { FilterChip } from "./FilterChip";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { BorderRadius, Spacing, Typography } from "../constants/Theme";
import { PlatformGroup, Genre } from "../services/igdb";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  style?: ViewStyle;
  isFilterExpanded?: boolean;
  platformGroups?: PlatformGroup[];
  genres?: Genre[];
  onPlatformPress?: (groupKey: string) => void;
  onGenrePress?: (genreId: number) => void;
  selectedPlatformGroup?: string | null;
  selectedGenre?: number | null;
}

export function SearchInput({
  value,
  onChangeText,
  onFilterPress,
  style,
  isFilterExpanded = false,
  platformGroups,
  genres,
  onPlatformPress,
  onGenrePress,
  selectedPlatformGroup,
  selectedGenre,
}: SearchInputProps) {
  return (
    <>
      <View style={[styles.container, style]}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.dark.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder="Search for games..."
            placeholderTextColor={Colors.dark.textSecondary}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
          <Ionicons name="options" size={20} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>
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
                onPress={() => onPlatformPress?.(item.groupKey)}
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
                onPress={() => onGenrePress?.(item.id)}
                isSelected={selectedGenre === item.id}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.filterList}
            style={styles.filterListContainer}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    height: 55,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: Typography.size.md,
    fontFamily: "Inter",
  },
  filterButton: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.round,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
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
});
