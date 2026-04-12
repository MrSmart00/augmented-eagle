import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PokemonSummary } from "@/src/shared";
import { fetchPokemonListGraphQL } from "../repository/pokemonGraphqlApi";

const PAGE_SIZE = 20;

export function usePokemonList() {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [pokemon, setPokemon] = useState<PokemonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  const loadInitial = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchPokemonListGraphQL(PAGE_SIZE, 0, language);
      setPokemon(result.pokemon);
      setHasMore(PAGE_SIZE < result.count);
      offsetRef.current = PAGE_SIZE;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [language]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      const result = await fetchPokemonListGraphQL(
        PAGE_SIZE,
        offsetRef.current,
        language,
      );
      setPokemon((prev) => [...prev, ...result.pokemon]);
      offsetRef.current += PAGE_SIZE;
      setHasMore(offsetRef.current < result.count);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  }, [hasMore, language]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setHasMore(true);
    await loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return {
    pokemon,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}
