import { useCallback, useEffect, useRef, useState } from "react";
import type { Pokemon } from "@/src/shared";
import { fetchPokemonList } from "../repository/pokemonApi";
import { toPokemon } from "../domain/pokemonListItem";

const PAGE_SIZE = 20;

export function usePokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
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
      const response = await fetchPokemonList(PAGE_SIZE, 0);
      setPokemon(response.results.map(toPokemon));
      setHasMore(response.next !== null);
      offsetRef.current = PAGE_SIZE;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      const response = await fetchPokemonList(PAGE_SIZE, offsetRef.current);
      setPokemon((prev) => [...prev, ...response.results.map(toPokemon)]);
      setHasMore(response.next !== null);
      offsetRef.current += PAGE_SIZE;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  }, [hasMore]);

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
