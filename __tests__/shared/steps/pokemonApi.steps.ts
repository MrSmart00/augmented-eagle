import { defineFeature, loadFeature } from "jest-cucumber";
import { fetchPokemonById } from "@/src/shared/repository/pokemonApi";

const feature = loadFeature("__tests__/shared/features/pokemonApi.feature");

const mockApiResponse = {
  id: 25,
  name: "pikachu",
  types: [
    {
      slot: 1,
      type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" },
    },
  ],
};

const mockMultiTypeResponse = {
  id: 1,
  name: "bulbasaur",
  types: [
    {
      slot: 1,
      type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
    },
    {
      slot: 2,
      type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
    },
  ],
};

const originalFetch = globalThis.fetch;

defineFeature(feature, (test) => {
  let result: Awaited<ReturnType<typeof fetchPokemonById>>;
  let error: Error;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("正しいURLでfetchを呼び出す", ({ given, when, then }) => {
    given("fetchがモックされている", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });
    });

    when(/^ポケモンID (\d+) で取得する$/, async (id: string) => {
      await fetchPokemonById(Number(id));
    });

    then(/^fetchが "(.*)" で呼ばれる$/, (url: string) => {
      expect(globalThis.fetch).toHaveBeenCalledWith(url);
    });
  });

  test("レスポンスをPokemon型に変換する", ({ given, when, then }) => {
    given("単一タイプのAPIレスポンスが返される", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });
    });

    when(/^ポケモンID (\d+) で取得する$/, async (id: string) => {
      result = await fetchPokemonById(Number(id));
    });

    then(
      /^IDが (\d+) で名前が "(.*)" でタイプが "(.*)" のPokemonが返される$/,
      (id: string, name: string, types: string) => {
        expect(result).toEqual({
          id: Number(id),
          name,
          types: types.split(","),
        });
      }
    );
  });

  test("複数タイプを正しく変換する", ({ given, when, then }) => {
    given("複数タイプのAPIレスポンスが返される", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMultiTypeResponse),
      });
    });

    when(/^ポケモンID (\d+) で取得する$/, async (id: string) => {
      result = await fetchPokemonById(Number(id));
    });

    then(
      /^IDが (\d+) で名前が "(.*)" でタイプが "(.*)" のPokemonが返される$/,
      (id: string, name: string, types: string) => {
        expect(result).toEqual({
          id: Number(id),
          name,
          types: types.split(","),
        });
      }
    );
  });

  test("空文字の名前が正しく処理される", ({ given, when, then }) => {
    given("空の名前のAPIレスポンスが返される", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: "", types: [] }),
      });
    });

    when(/^ポケモンID (\d+) で取得する$/, async (id: string) => {
      result = await fetchPokemonById(Number(id));
    });

    then("名前が空文字である", () => {
      expect(result.name).toBe("");
    });
  });

  test("HTTPエラー時にエラーをスローする", ({ given, when, then }) => {
    given(/^HTTPエラー (\d+) が返される$/, (status: string) => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: Number(status),
      });
    });

    when(/^ポケモンID (\d+) で取得する$/, async (id: string) => {
      try {
        await fetchPokemonById(Number(id));
      } catch (e) {
        error = e as Error;
      }
    });

    then(/^"(.*)" エラーがスローされる$/, (message: string) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(message);
    });
  });
});
