import type { PokemonSummary, PokemonType } from "@/src/shared";
import { capitalizeName } from "../domain/pokemonListItem";

const GRAPHQL_ENDPOINT = "https://beta.pokeapi.co/graphql/v1beta";

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

interface PokemonListGraphQLData {
  pokemon_v2_pokemon: {
    id: number;
    pokemon_v2_pokemonspecy: {
      name: string;
      pokemon_v2_pokemonspeciesnames: { name: string }[];
    };
    pokemon_v2_pokemontypes: {
      pokemon_v2_type: { name: string };
    }[];
  }[];
  pokemon_v2_pokemon_aggregate: {
    aggregate: { count: number };
  };
}

export interface PokemonListResult {
  count: number;
  pokemon: PokemonSummary[];
}

const POKEMON_LIST_QUERY = `
  query PokemonList($limit: Int!, $offset: Int!, $language: String!) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: {id: asc}) {
      id
      pokemon_v2_pokemonspecy {
        name
        pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {name: {_eq: $language}}}) {
          name
        }
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type { name }
      }
    }
    pokemon_v2_pokemon_aggregate {
      aggregate { count }
    }
  }
`;

async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }
  const json = (await response.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`GraphQL error: ${json.errors[0].message}`);
  }
  if (!json.data) {
    throw new Error("GraphQL response missing data");
  }
  return json.data;
}

export async function fetchPokemonListGraphQL(
  limit: number,
  offset: number,
  language: string,
): Promise<PokemonListResult> {
  const data = await graphqlFetch<PokemonListGraphQLData>(
    POKEMON_LIST_QUERY,
    { limit, offset, language },
  );

  const pokemon: PokemonSummary[] = data.pokemon_v2_pokemon.map((p) => {
    const localizedName =
      p.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames[0]?.name;
    const fallbackName = capitalizeName(p.pokemon_v2_pokemonspecy.name);
    return {
      id: p.id,
      name: localizedName ?? fallbackName,
      types: p.pokemon_v2_pokemontypes.map(
        (t) => t.pokemon_v2_type.name as PokemonType,
      ),
    };
  });

  return {
    count: data.pokemon_v2_pokemon_aggregate.aggregate.count,
    pokemon,
  };
}
