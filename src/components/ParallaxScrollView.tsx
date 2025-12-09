import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { TouchableOpacity, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TextVariants, BorderRadius } from "../constants/Theme";
import { Colors } from "../constants/Colors";
import { Screen } from "./Screen";

const HEADER_HEIGHT = 300;

type Props = PropsWithChildren<{
  headerComponent: ReactElement;
}>;

export default function ParallaxScrollView({
  children,
  headerComponent,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = 0;
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <Screen padless>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: Colors.dark.background },
            headerAnimatedStyle,
          ]}
        >
          {headerComponent}
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: top }]}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.dark.primary} />
        <Text style={TextVariants.text}>Voltar</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 10,
    overflow: "hidden",
    backgroundColor: Colors.dark.background,
  },
  backButton: {
    position: "absolute",
    flexDirection: "row",
    padding: 5,
    left: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
