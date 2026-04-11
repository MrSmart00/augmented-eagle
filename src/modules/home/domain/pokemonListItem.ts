import type { Pokemon } from "@/src/shared";
import { capitalizeName } from "@/src/shared/repository/pokemonApi";

export { capitalizeName } from "@/src/shared/repository/pokemonApi";

export interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiListItem[];
}

export interface PokeApiListItem {
  name: string;
  url: string;
}

export function extractPokemonId(url: string): number {
  const segments = url.replace(/\/$/, "").split("/");
  return Number(segments[segments.length - 1]);
}

export function toPokemon(item: PokeApiListItem): Pokemon {
  return {
    id: extractPokemonId(item.url),
    name: capitalizeName(item.name),
    types: [],
  };
}
