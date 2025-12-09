import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import ParallaxScrollView from "@/src/components/ParallaxScrollView";
import { useLocalSearchParams } from "expo-router";
import { TextVariants } from "@/src/constants/Theme";
import { FilterChip } from "@/src/components/FilterChip";
import { renderPlatformIcons } from "@/src/components/GameCard";
import { StarsRating } from "@/src/components/StarsRating";
import { Button } from "@/src/components/Button";

export default function GameScreen() {
  const { cover, genres, game } = useLocalSearchParams();
  const [expandSummary, setExpandSummary] = useState(false);

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

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button title="Ja joguei" icon="check" onPress={() => {}} />
        <Button
          title="Interesse"
          icon="heart"
          preset="secondary"
          onPress={() => {}}
        />
      </View>

      <StarsRating
        score={gameParsed?.total_rating}
        amount={gameParsed?.total_rating_count}
      />
      <View style={{ flexDirection: "row" }}>
        {genresParsed?.map((genre: string) => (
          <FilterChip item={genre} unpressable key={genre} />
        ))}
      </View>
      <Text style={TextVariants.subtitle}>Description</Text>
      <Text style={TextVariants.text}>{gameParsed.storyline}</Text>
      {expandSummary && (
        <Text style={TextVariants.text}>{gameParsed.summary}</Text>
      )}
      <Text
        onPress={() => setExpandSummary(!expandSummary)}
        style={[TextVariants.link, { textAlign: "right" }]}
      >
        {expandSummary ? "Ver menos" : "Ver mais"}
      </Text>
    </ParallaxScrollView>
  );
}
