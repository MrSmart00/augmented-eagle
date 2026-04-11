import type { Pokemon, PokemonType } from "../domain/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

interface PokeApiPokemonResponse {
  id: number;
  name: string;
  types: {
    slot: number;
    type: { name: string; url: string };
  }[];
}

export function capitalizeName(name: string): string {
  if (name.length === 0) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export async function fetchPokemonById(id: number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon: ${response.status}`);
  }
  const data = (await response.json()) as PokeApiPokemonResponse;
  return {
    id: data.id,
    name: capitalizeName(data.name),
    types: data.types.map((t) => t.type.name as PokemonType),
  };
}
