import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../constants/Colors";
import { TextVariants } from "../constants/Theme";

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  canGoBack?: boolean;
  backgroundColor?: string;
  centralize?: boolean;
  padless?: boolean;
}

interface Props {
  children?: React.ReactNode;
  backgroundColor: string;
  center?: boolean;
}

function ScrollViewContainer({ children, backgroundColor }: Props) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor, flex: 1 }}
    >
      {children}
    </ScrollView>
  );
}

function ViewContainer({ children, backgroundColor, center = false }: Props) {
  return (
    <View
      style={[
        { backgroundColor, flex: 1 },
        center ? styles.centralizedContainer : styles.container,
      ]}
    >
      {children}
    </View>
  );
}

export function Screen({
  children,
  scrollable = false,
  canGoBack = false,
  backgroundColor = Colors.dark.background,
  centralize = false,
  padless = false,
}: ScreenProps) {
  const { top, bottom } = useSafeAreaInsets();
  const Container = scrollable ? ScrollViewContainer : ViewContainer;
  const router = useRouter();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Container backgroundColor={backgroundColor} center={centralize}>
        <View
          style={{
            paddingHorizontal: padless ? 0 : 20,
            paddingTop: top,
            paddingBottom: bottom,
          }}
        >
          {canGoBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.dark.primary}
              />
              <Text style={TextVariants.text}>Voltar</Text>
            </TouchableOpacity>
          )}
          {children}
        </View>
      </Container>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {},

  centralizedContainer: {
    justifyContent: "center",
  },

  backButton: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingLeft: 5,
    //backgroundColor: "transparent",
  },

  icon: {
    marginLeft: -5,
  },
});
