import type { PokeApiListResponse } from "../domain/pokemonListItem";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(
  limit: number,
  offset: number
): Promise<PokeApiListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon list: ${response.status}`);
  }
  return response.json() as Promise<PokeApiListResponse>;
}
