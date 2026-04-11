import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PokemonSummary } from "@/src/shared";
import { fetchPokemonById } from "@/src/shared";
import { fetchPokemonSpeciesInfo } from "@/src/shared";

export function usePokemonByIds(ids: number[]) {
  const { i18n } = useTranslation();
  const language = i18n.language;
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

    Promise.all(
      ids.map(async (id) => {
        const [base, species] = await Promise.all([
          fetchPokemonById(id),
          fetchPokemonSpeciesInfo(id, language),
        ]);
        return {
          ...base,
          name: species.localizedName ?? base.name,
        };
      }),
    )
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
  }, [idsKey, language]);

  return { pokemon, isLoading, error };
}
