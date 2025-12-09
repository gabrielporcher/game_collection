import React from "react";
import { View, Text, Image } from "react-native";
import ParallaxScrollView from "@/src/components/ParallaxScrollView";
import { useLocalSearchParams } from "expo-router";
import { TextVariants } from "@/src/constants/Theme";
import { FilterChip } from "@/src/components/FilterChip";
import { renderPlatformIcons } from "@/src/components/GameCard";

export default function GameScreen() {
  const { cover, genres, game } = useLocalSearchParams();

  const gameParsed = JSON.parse(game as string);
  const genresParsed = JSON.parse(genres as string);

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
      <Text style={TextVariants.title}>{gameParsed.name}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {genresParsed?.map((genre: string) => (
          <FilterChip item={genre} unpressable key={genre} />
        ))}
      </View>
      {renderPlatformIcons(JSON.parse(game as string), true)}
      <Text style={TextVariants.text}>{gameParsed.storyline}</Text>
      <Text style={TextVariants.text}>{gameParsed.summary}</Text>
    </ParallaxScrollView>
  );
}
