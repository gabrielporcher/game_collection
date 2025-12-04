import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { BorderRadius, Spacing, Typography } from "../constants/Theme";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  style?: ViewStyle;
}

export function SearchInput({
  value,
  onChangeText,
  onFilterPress,
  style,
}: SearchInputProps) {
  return (
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
});
