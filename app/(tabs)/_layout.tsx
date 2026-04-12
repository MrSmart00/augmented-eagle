import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#e74c3c" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.pokedex"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="list" size={focused ? size + 4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t("tabs.favorites"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="heart" size={focused ? size + 4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="settings-sharp" size={focused ? size + 4 : size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
