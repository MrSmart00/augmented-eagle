import { defineFeature, loadFeature } from "jest-cucumber";
import { fetchPokemonListGraphQL } from "@/src/home/repository/pokemonGraphqlApi";
import type { PokemonListResult } from "@/src/home/repository/pokemonGraphqlApi";

const feature = loadFeature(
  "__tests__/home/features/pokemonGraphqlApi.feature"
);

const mockGraphQLResponse = {
  data: {
    pokemon_v2_pokemon: [
      {
        id: 1,
        pokemon_v2_pokemonspecy: {
          name: "bulbasaur",
          pokemon_v2_pokemonspeciesnames: [{ name: "フシギダネ" }],
        },
        pokemon_v2_pokemontypes: [
          { pokemon_v2_type: { name: "grass" } },
          { pokemon_v2_type: { name: "poison" } },
        ],
      },
      {
        id: 4,
        pokemon_v2_pokemonspecy: {
          name: "charmander",
          pokemon_v2_pokemonspeciesnames: [{ name: "ヒトカゲ" }],
        },
        pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: "fire" } }],
      },
    ],
    pokemon_v2_pokemon_aggregate: {
      aggregate: { count: 1025 },
    },
  },
};

const mockEmptyNameResponse = {
  data: {
    pokemon_v2_pokemon: [
      {
        id: 1,
        pokemon_v2_pokemonspecy: {
          name: "bulbasaur",
          pokemon_v2_pokemonspeciesnames: [],
        },
        pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: "grass" } }],
      },
    ],
    pokemon_v2_pokemon_aggregate: {
      aggregate: { count: 1 },
    },
  },
};

const originalFetch = globalThis.fetch;

defineFeature(feature, (test) => {
  let resultPromise: Promise<PokemonListResult>;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("GraphQLエンドポイントにPOSTリクエストを送信する", ({
    given,
    when,
    then,
    and,
  }) => {
    given("fetchがモックされている", () => {
      // Already mocked in beforeEach
    });

    and("fetchがGraphQL正常レスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGraphQLResponse),
      });
    });

    when(
      /^fetchPokemonListGraphQLを limit (\d+) offset (\d+) lang "(.*)" で呼び出す$/,
      async (limit: string, offset: string, lang: string) => {
        resultPromise = fetchPokemonListGraphQL(
          Number(limit),
          Number(offset),
          lang
        );
        await resultPromise;
      }
    );

    then(
      /^fetchが "(.*)" にPOSTで呼ばれる$/,
      (url: string) => {
        expect(globalThis.fetch).toHaveBeenCalledWith(
          url,
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })
        );
      }
    );
  });

  test("ローカライズされたポケモン名とタイプを返す", ({
    given,
    when,
    then,
    and,
  }) => {
    let result: PokemonListResult;

    given("fetchがモックされている", () => {
      // Already mocked in beforeEach
    });

    and("fetchがGraphQL正常レスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGraphQLResponse),
      });
    });

    when(
      /^fetchPokemonListGraphQLを limit (\d+) offset (\d+) lang "(.*)" で呼び出す$/,
      async (limit: string, offset: string, lang: string) => {
        result = await fetchPokemonListGraphQL(
          Number(limit),
          Number(offset),
          lang
        );
      }
    );

    then(/^総件数は (\d+) である$/, (count: string) => {
      expect(result.count).toBe(Number(count));
    });

    and(/^ポケモンの件数は (\d+) である$/, (count: string) => {
      expect(result.pokemon).toHaveLength(Number(count));
    });

    and(
      /^(\d+)番目のポケモンはID (\d+) 名前 "(.*)" タイプ "(.*)" である$/,
      (index: string, id: string, name: string, types: string) => {
        const i = Number(index) - 1;
        expect(result.pokemon[i]).toEqual({
          id: Number(id),
          name,
          types: types.split(","),
        });
      }
    );

    and(
      /^(\d+)番目のポケモンはID (\d+) 名前 "(.*)" タイプ "(.*)" である$/,
      (index: string, id: string, name: string, types: string) => {
        const i = Number(index) - 1;
        expect(result.pokemon[i]).toEqual({
          id: Number(id),
          name,
          types: types.split(","),
        });
      }
    );
  });

  test("ローカライズ名がない場合はspecies名にフォールバックする", ({
    given,
    when,
    then,
    and,
  }) => {
    let result: PokemonListResult;

    given("fetchがモックされている", () => {
      // Already mocked in beforeEach
    });

    and("fetchがローカライズ名なしのGraphQLレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEmptyNameResponse),
      });
    });

    when(
      /^fetchPokemonListGraphQLを limit (\d+) offset (\d+) lang "(.*)" で呼び出す$/,
      async (limit: string, offset: string, lang: string) => {
        result = await fetchPokemonListGraphQL(
          Number(limit),
          Number(offset),
          lang
        );
      }
    );

    then(/^1番目のポケモンの名前は "(.*)" である$/, (name: string) => {
      expect(result.pokemon[0].name).toBe(name);
    });
  });

  test("HTTPエラー時にエラーをスローする", ({ given, when, then, and }) => {
    given("fetchがモックされている", () => {
      // Already mocked in beforeEach
    });

    and(/^fetchがステータス (\d+) のHTTPエラーを返す$/, (status: string) => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: Number(status),
      });
    });

    when(
      /^fetchPokemonListGraphQLを limit (\d+) offset (\d+) lang "(.*)" で呼び出す$/,
      (limit: string, offset: string, lang: string) => {
        resultPromise = fetchPokemonListGraphQL(
          Number(limit),
          Number(offset),
          lang
        );
      }
    );

    then(/^"(.*)" エラーがスローされる$/, async (errorMessage: string) => {
      await expect(resultPromise).rejects.toThrow(errorMessage);
    });
  });

  test("GraphQLエラー時にエラーをスローする", ({ given, when, then, and }) => {
    given("fetchがモックされている", () => {
      // Already mocked in beforeEach
    });

    and("fetchがGraphQLエラーレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [{ message: "Field not found" }],
          }),
      });
    });

    when(
      /^fetchPokemonListGraphQLを limit (\d+) offset (\d+) lang "(.*)" で呼び出す$/,
      (limit: string, offset: string, lang: string) => {
        resultPromise = fetchPokemonListGraphQL(
          Number(limit),
          Number(offset),
          lang
        );
      }
    );

    then(/^"(.*)" エラーがスローされる$/, async (errorMessage: string) => {
      await expect(resultPromise).rejects.toThrow(errorMessage);
    });
  });
});
