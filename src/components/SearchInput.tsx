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
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    //height: 50,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: Typography.size.md,
    fontFamily: "Inter", // Assuming Inter or system font
  },
  filterButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
    backgroundColor: Colors.dark.border, // Slightly lighter than surface for contrast? Or just transparent
    borderRadius: BorderRadius.round,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
