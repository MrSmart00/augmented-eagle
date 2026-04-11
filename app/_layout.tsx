import { useEffect } from "react";
import { Stack } from "expo-router";
import { I18nextProvider, useTranslation } from "react-i18next";
import { FavoritesProvider, i18n, initI18n } from "@/src/shared";

function RootLayoutNav() {
  const { t } = useTranslation();

  useEffect(() => {
    initI18n();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[id]" options={{ title: t("navigation.detail") }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <FavoritesProvider>
        <RootLayoutNav />
      </FavoritesProvider>
    </I18nextProvider>
  );
}
