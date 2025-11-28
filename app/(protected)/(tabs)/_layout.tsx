import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Games",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Config",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
