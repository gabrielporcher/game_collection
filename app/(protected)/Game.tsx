import React from "react";
import { View, Text, Image } from "react-native";
import ParallaxScrollView from "@/src/components/ParallaxScrollView";
import { useLocalSearchParams } from "expo-router";

export default function GameScreen() {
  const { name, cover, rating, storyline, platforms, summary } =
    useLocalSearchParams();
  const coverUrl = Array.isArray(cover) ? cover[0] : cover;
  const coverBig = coverUrl
    ? `https:${coverUrl.replace("t_thumb", "t_cover_big")}`
    : "";
  return (
    <ParallaxScrollView
      headerComponent={
        <Image
          source={{ uri: coverBig }}
          style={{ width: "100%", height: 300 }}
          resizeMode="cover"
        />
      }
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{name}</Text>
      <Text style={{ fontSize: 16 }}>{storyline}</Text>
      <Text style={{ fontSize: 16 }}>{summary}</Text>
    </ParallaxScrollView>
  );
}
