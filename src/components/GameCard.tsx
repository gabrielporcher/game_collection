import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Game, PLATFORM_GROUPS } from "../services/igdb";
import { Colors } from "../constants/Colors";
import { BorderRadius, Spacing, Typography } from "../constants/Theme";

interface GameCardProps {
  game: Game;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.md * 3) / 2; // 2 columns with padding
const CARD_HEIGHT = CARD_WIDTH * 1.3; // Aspect ratio ~3:4

export function GameCard({ game, onPress }: GameCardProps) {
  const renderPlatformIcons = () => {
    if (!game.platforms) return null;

    const icons: React.ReactNode[] = [];
    const renderedGroups = new Set<string>();

    // Map groups to icons
    const groupIcons: Record<
      string,
      { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string }
    > = {
      playstation: { name: "sony-playstation", color: "#fff" },
      xbox: { name: "microsoft-xbox", color: "#fff" },
      nintendo: { name: "nintendo-switch", color: "#fff" },
      pc: { name: "monitor", color: "#fff" },
      mobile: { name: "cellphone", color: "#fff" },
      sega: { name: "alpha-s-box-outline", color: "#fff" },
    };

    // Check each group
    for (const [groupKey, ids] of Object.entries(PLATFORM_GROUPS)) {
      // If the game has any platform from this group
      if (game.platforms.some((pId) => ids.includes(pId))) {
        if (!renderedGroups.has(groupKey) && groupIcons[groupKey]) {
          renderedGroups.add(groupKey);
          icons.push(
            <MaterialCommunityIcons
              key={groupKey}
              name={groupIcons[groupKey].name}
              size={12}
              color={groupIcons[groupKey].color}
              style={styles.icon}
            />
          );
        }
      }
    }

    return <View style={styles.platformIcons}>{icons}</View>;
  };

  const imageUrl = game.cover
    ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
    : null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cover, styles.placeholder]}>
          <Ionicons
            name="game-controller"
            size={40}
            color={Colors.dark.textSecondary}
          />
        </View>
      )}

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.overlay}
      >
        <View style={styles.header}>{/* Platform icons top right */}</View>

        <View style={styles.footer}>
          <Text style={styles.title} numberOfLines={2}>
            {game.name}
          </Text>
        </View>
      </LinearGradient>

      {/* Absolute positioned platform icons */}
      <View style={styles.topRight}>{renderPlatformIcons()}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.surface,
    marginBottom: Spacing.md,
    overflow: "hidden",
    position: "relative",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%", // Gradient covers bottom half
    justifyContent: "flex-end",
    padding: Spacing.sm,
  },
  header: {
    flex: 1,
  },
  footer: {
    justifyContent: "flex-end",
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.size.md,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  topRight: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: BorderRadius.sm,
    padding: 4,
  },
  platformIcons: {
    flexDirection: "row",
    gap: 4,
  },
  icon: {
    marginLeft: 2,
  },
});
