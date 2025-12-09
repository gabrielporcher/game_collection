import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { Spacing, TextVariants } from "../constants/Theme";

interface StarsRatingProps {
  score: number;
  amount: number;
}

export function StarsRating({ score, amount }: StarsRatingProps) {
  // Convert 0-100 score to 0-5
  const rating = score / 20;

  const displayScore = (score / 10).toFixed(1);

  const renderStars = () => {
    const stars = [];
    // We want 5 stars total
    for (let i = 1; i <= 5; i++) {
      // if rating >= i : full
      // if rating >= i - 0.5 : half
      // else empty

      let iconName: "star" | "star-half" | "star-alt" = "star-alt";
      let color = Colors.dark.primary;

      if (rating >= i) {
        iconName = "star";
      } else if (rating >= i - 0.5) {
        iconName = "star-half";
      } else {
        iconName = "star";
        color = Colors.dark.textSecondary;
      }

      stars.push(
        <Fontisto
          key={i}
          name={iconName}
          size={24}
          color={color}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  if (!score) {
    return (
      <View>
        <Text style={[styles.scoreText, { marginLeft: Spacing.sm }]}>
          Sem reviews
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>{renderStars()}</View>

      <Text style={[styles.scoreText, { marginLeft: Spacing.sm }]}>
        {displayScore}
      </Text>

      <Text style={styles.amountText}>({amount} avaliações)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  starsContainer: {
    flexDirection: "row",
  },
  scoreText: {
    ...TextVariants.text,
    fontWeight: "bold",
    color: Colors.dark.primary,
  },
  amountText: {
    ...TextVariants.text,
    color: Colors.dark.textSecondary,
    marginLeft: 4,
  },
});
