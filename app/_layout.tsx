import { Stack } from "expo-router";
import { FavoritesProvider } from "@/src/shared";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[id]" options={{ title: "詳細" }} />
      </Stack>
    </FavoritesProvider>
  );
}
