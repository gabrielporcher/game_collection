import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { BorderRadius, TextVariants } from "../constants/Theme";
import { Colors } from "../constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  icon?: keyof typeof FontAwesome.glyphMap;
  preset?: "default" | "secondary" | "outline";
}

const presets = {
  default: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.background,
    textColor: Colors.dark.text,
  },
  secondary: {
    backgroundColor: Colors.dark.text,
    borderColor: Colors.dark.text,
    textColor: Colors.dark.background,
  },
  outline: {
    backgroundColor: Colors.dark.background,
    borderColor: Colors.dark.primary,
    textColor: Colors.dark.primary,
  },
};

export function Button({
  title,
  onPress,
  icon,
  preset = "default",
}: ButtonProps) {
  const buttonPreset = presets[preset];
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { ...buttonPreset }]}
    >
      {icon && (
        <FontAwesome name={icon} size={18} color={buttonPreset.textColor} />
      )}
      <Text style={[TextVariants.button, { color: buttonPreset.textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    gap: 5,
  },
});
