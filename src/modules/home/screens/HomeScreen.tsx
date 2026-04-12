import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator testID="loading-indicator" size="large" />
      </SafeAreaView>
    );
  }

  if (error && pokemon.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text testID="error-text">{error}</Text>
      </SafeAreaView>
    );
  }

  const gridData: (PokemonSummary | null)[] =
    filteredItems.length % 2 === 1 ? [...filteredItems, null] : filteredItems;

  return (
    <SafeAreaView style={styles.container}>
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
      />
    </SafeAreaView>
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
    paddingVertical: 32,
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
