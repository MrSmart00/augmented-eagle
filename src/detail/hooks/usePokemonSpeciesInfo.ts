import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchPokemonSpeciesInfo } from "../repository/pokemonSpeciesApi";
import type { PokemonSpeciesInfo } from "../repository/pokemonSpeciesApi";

export function usePokemonSpeciesInfo(id: number) {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [speciesInfo, setSpeciesInfo] = useState<PokemonSpeciesInfo>({
    localizedName: null,
    flavorText: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchPokemonSpeciesInfo(id, language)
      .then((info) => {
        if (!cancelled) setSpeciesInfo(info);
      })
      .catch(() => {
        // species情報は任意なのでエラ���を無視
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, language]);

  return { ...speciesInfo, isLoading };
}
