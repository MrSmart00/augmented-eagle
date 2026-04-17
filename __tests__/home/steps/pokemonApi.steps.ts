import { defineFeature, loadFeature } from "jest-cucumber";
import { fetchPokemonList } from "@/src/home";
import type { PokeApiListResponse } from "@/src/home/domain/pokemonListItem";

const feature = loadFeature("__tests__/home/features/pokemonApi.feature");

const mockResponse: PokeApiListResponse = {
  count: 1302,
  next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  previous: null,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  ],
};

const originalFetch = globalThis.fetch;

defineFeature(feature, (test) => {
  let resultPromise: Promise<PokeApiListResponse>;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("正しいURLでfetchを呼び出す", ({ given, when, then, and }) => {
    given("fetchがモックされている", () => {
      // Already mocked in beforeEach
    });

    and("fetchが正常なレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
    });

    when(
      /^fetchPokemonListを limit (\d+) offset (\d+) で呼び出す$/,
      async (limit: string, offset: string) => {
        resultPromise = fetchPokemonList(Number(limit), Number(offset));
        await resultPromise;
      }
    );

    then(/^fetchが "(.*)" で呼ばれる$/, (url: string) => {
      expect(globalThis.fetch).toHaveBeenCalledWith(url);
    });
  });

  test("レスポンスをパースして返す", ({ given, when, then, and }) => {
    given("fetchがモックされている", () => {
      // Already mocked in beforeEach
    });

    and("fetchが正常なレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
    });

    when(
      /^fetchPokemonListを limit (\d+) offset (\d+) で呼び出す$/,
      async (limit: string, offset: string) => {
        resultPromise = fetchPokemonList(Number(limit), Number(offset));
      }
    );

    then("レスポンスがパースされて返される", async () => {
      const result = await resultPromise;
      expect(result).toEqual(mockResponse);
    });
  });

  test("HTTPエラー時にエラーをスローする", ({ given, when, then, and }) => {
    given("fetchがモックされている", () => {
      // Already mocked in beforeEach
    });

    and(
      /^fetchがステータス (\d+) のエラーレスポンスを返す$/,
      (status: string) => {
        (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: Number(status),
        });
      }
    );

    when(
      /^fetchPokemonListを limit (\d+) offset (\d+) で呼び出す$/,
      (limit: string, offset: string) => {
        resultPromise = fetchPokemonList(Number(limit), Number(offset));
      }
    );

    then(/^"(.*)" エラーがスローされる$/, async (errorMessage: string) => {
      await expect(resultPromise).rejects.toThrow(errorMessage);
    });
  });

  test("ネットワークエラー時にエラーをスローする", ({
    given,
    when,
    then,
    and,
  }) => {
    given("fetchがモックされている", () => {
      // Already mocked in beforeEach
    });

    and(
      /^fetchが "(.*)" ネットワークエラーを返す$/,
      (errorMessage: string) => {
        (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
          new Error(errorMessage)
        );
      }
    );

    when(
      /^fetchPokemonListを limit (\d+) offset (\d+) で呼び出す$/,
      (limit: string, offset: string) => {
        resultPromise = fetchPokemonList(Number(limit), Number(offset));
      }
    );

    then(/^"(.*)" エラーがスローされる$/, async (errorMessage: string) => {
      await expect(resultPromise).rejects.toThrow(errorMessage);
    });
  });
});
