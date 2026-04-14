import { useEffect } from "react";
import { Stack } from "expo-router";
import { I18nextProvider, useTranslation } from "react-i18next";
import * as SplashScreen from "expo-splash-screen";
import { i18n, initI18n } from "@/src/shared";
import { AnimatedSplash } from "@/src/splash";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { t } = useTranslation();

  useEffect(() => {
    initI18n();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[id]" options={{ title: t("navigation.detail"), headerBackButtonDisplayMode: "minimal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <AnimatedSplash>
        <RootLayoutNav />
      </AnimatedSplash>
    </I18nextProvider>
  );
}
