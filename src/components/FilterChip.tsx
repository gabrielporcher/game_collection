import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Spacing, BorderRadius, TextVariants } from "../constants/Theme";
import { Colors } from "../constants/Colors";

import { PlatformGroup, Genre } from "../services/igdb";

interface FilterChipProps {
  item: PlatformGroup | Genre | string;
  onPress?: () => void;
  isSelected?: boolean;
  unpressable?: boolean;
}

export function FilterChip({
  item,
  onPress,
  isSelected,
  unpressable = false,
}: FilterChipProps) {
  const Wrapper = unpressable ? View : TouchableOpacity;

  const label =
    typeof item === "string"
      ? item
      : "groupKey" in item
      ? item.displayName
      : item.name;

  return (
    <Wrapper
      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text style={TextVariants.chip}>{label}</Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  filterChipSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
});
