import { useEffect, useState } from "react";
import type { PokemonSummary } from "@/src/shared";
import { fetchPokemonById } from "@/src/shared";

export function usePokemonByIds(ids: number[]) {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idsKey = ids.join(",");

  useEffect(() => {
    if (ids.length === 0) {
      setPokemon([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all(ids.map((id) => fetchPokemonById(id)))
      .then((results) => {
        if (!cancelled) setPokemon(results);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return { pokemon, isLoading, error };
}
