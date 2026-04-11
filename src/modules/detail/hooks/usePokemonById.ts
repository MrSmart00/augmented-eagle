import { useEffect, useState } from "react";
import type { Pokemon } from "@/src/shared";
import { fetchPokemonById } from "@/src/shared";

export function usePokemonById(id: number) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchPokemonById(id)
      .then((data) => {
        if (!cancelled) setPokemon(data);
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
  }, [id]);

  return { pokemon, isLoading, error };
}
