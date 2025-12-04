import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/Colors";
import { Spacing, BorderRadius, Typography } from "@/src/constants/Theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.dark.surface,
          borderTopWidth: 0, // Remove top border for floating look
          height: 60,
          //paddingBottom: Spacing.sm,
          //paddingTop: Spacing.sm,
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: BorderRadius.round,
          elevation: 5, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          marginHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontSize: Typography.size.sm,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Jogos",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="game-controller" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Biblioteca",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="library" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
