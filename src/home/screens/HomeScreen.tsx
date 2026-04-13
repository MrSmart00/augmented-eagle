import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { PokemonCard, useFavorites } from "@/src/shared";
import type { PokemonSummary } from "@/src/shared";
import { useSearch } from "../hooks/useSearch";
import { usePokemonList } from "../hooks/usePokemonList";
import { FloatingSearchButton } from "../components/FloatingSearchButton";

export function HomeScreen() {
  const {
    pokemon,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    error,
    loadMore,
    refresh,
  } = usePokemonList();
  const { searchText, setSearchText, filteredItems } = useSearch(pokemon);
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator testID="loading-indicator" size="large" />
      </View>
    );
  }

  if (error && pokemon.length === 0) {
    return (
      <View style={styles.centered}>
        <Text testID="error-text">{error}</Text>
      </View>
    );
  }

  const gridData: (PokemonSummary | null)[] =
    filteredItems.length % 2 === 1 ? [...filteredItems, null] : filteredItems;

  return (
    <View style={styles.container}>
      <FlatList
        data={gridData}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            {item && (
              <Link href={`/detail/${item.id}`} asChild>
                <PokemonCard
                  pokemon={item}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              </Link>
            )}
          </View>
        )}
        extraData={favoriteIds}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        onEndReached={() => {
          if (hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              testID="loading-more-indicator"
              style={styles.footer}
            />
          ) : null
        }
      />
      <FloatingSearchButton
        searchText={searchText}
        onChangeText={setSearchText}
        placeholder={t("home.searchPlaceholder")}
        keyboardHeight={keyboardHeight > 0 ? keyboardHeight - tabBarHeight : 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 80,
    gap: 16,
  },
  row: {
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
  },
  footer: {
    paddingVertical: 16,
  },
});
