import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "ポケモン図鑑",
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "お気に入り",
        }}
      />
    </Tabs>
  );
}
