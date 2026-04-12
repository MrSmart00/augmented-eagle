import type { Pokemon, PokemonType } from "@/src/shared";

const BASE_URL = "https://pokeapi.co/api/v2";

interface PokeApiDetailResponse {
  id: number;
  name: string;
  types: {
    slot: number;
    type: { name: string; url: string };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }[];
}

function capitalizeName(name: string): string {
  if (name.length === 0) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export async function fetchPokemonDetail(id: number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon detail: ${response.status}`);
  }
  const data = (await response.json()) as PokeApiDetailResponse;
  return {
    id: data.id,
    name: capitalizeName(data.name),
    types: data.types.map((t) => t.type.name as PokemonType),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      baseStat: s.base_stat,
    })),
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map((a) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
  };
}
