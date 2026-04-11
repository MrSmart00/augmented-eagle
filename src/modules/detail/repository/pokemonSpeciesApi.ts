const BASE_URL = "https://pokeapi.co/api/v2";

interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string; url: string };
  version: { name: string; url: string };
}

interface PokeApiSpeciesResponse {
  flavor_text_entries: FlavorTextEntry[];
}

export async function fetchPokemonFlavorText(id: number): Promise<string | null> {
  const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon species: ${response.status}`);
  }
  const data = (await response.json()) as PokeApiSpeciesResponse;

  const enEntry = data.flavor_text_entries.find((e) => e.language.name === "en");
  if (enEntry) return enEntry.flavor_text;

  return null;
}
