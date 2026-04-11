import { useEffect, useState } from "react";
import { fetchPokemonFlavorText } from "../repository/pokemonSpeciesApi";

export function usePokemonFlavorText(id: number) {
  const [flavorText, setFlavorText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchPokemonFlavorText(id)
      .then((text) => {
        if (!cancelled) setFlavorText(text);
      })
      .catch(() => {
        // フレーバーテキストは任意なのでエラーを無視
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { flavorText, isLoading };
}
