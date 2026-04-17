import { defineFeature, loadFeature } from "jest-cucumber";
import { fetchPokemonDetail } from "@/src/detail/repository/pokemonDetailApi";
import type { Pokemon } from "@/src/shared";

const feature = loadFeature(
  "__tests__/detail/features/pokemonDetailApi.feature"
);

const mockApiResponse = {
  id: 25,
  name: "pikachu",
  types: [
    { slot: 1, type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" } },
  ],
  stats: [
    { base_stat: 35, effort: 0, stat: { name: "hp", url: "" } },
    { base_stat: 55, effort: 0, stat: { name: "attack", url: "" } },
    { base_stat: 40, effort: 0, stat: { name: "defense", url: "" } },
    { base_stat: 50, effort: 0, stat: { name: "special-attack", url: "" } },
    { base_stat: 50, effort: 0, stat: { name: "special-defense", url: "" } },
    { base_stat: 90, effort: 0, stat: { name: "speed", url: "" } },
  ],
  height: 4,
  weight: 60,
  abilities: [
    { ability: { name: "static", url: "" }, is_hidden: false, slot: 1 },
    { ability: { name: "lightning-rod", url: "" }, is_hidden: true, slot: 3 },
  ],
};

const originalFetch = globalThis.fetch;

defineFeature(feature, (test) => {
  let result: Pokemon;
  let fetchError: Error | null;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
    fetchError = null;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("正しいURLでfetchを呼び出す", ({ given, when, then }) => {
    given("PokeAPIがピカチュウのレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });
    });

    when("fetchPokemonDetailをID25で呼び出す", async () => {
      result = await fetchPokemonDetail(25);
    });

    then(/^fetchが「(.*)」で呼ばれる$/, (url: string) => {
      expect(globalThis.fetch).toHaveBeenCalledWith(url);
    });
  });

  test("レスポンスからステータスを正しく変換する", ({ given, when, then }) => {
    given("PokeAPIがピカチュウのレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });
    });

    when("fetchPokemonDetailをID25で呼び出す", async () => {
      result = await fetchPokemonDetail(25);
    });

    then("ステータスが正しく変換される", () => {
      expect(result.stats).toEqual([
        { name: "hp", baseStat: 35 },
        { name: "attack", baseStat: 55 },
        { name: "defense", baseStat: 40 },
        { name: "special-attack", baseStat: 50 },
        { name: "special-defense", baseStat: 50 },
        { name: "speed", baseStat: 90 },
      ]);
    });
  });

  test("身長と体重を正しく変換する", ({ given, when, then, and }) => {
    given("PokeAPIがピカチュウのレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });
    });

    when("fetchPokemonDetailをID25で呼び出す", async () => {
      result = await fetchPokemonDetail(25);
    });

    then(/^身長が(\d+)である$/, (height: string) => {
      expect(result.height).toBe(Number(height));
    });

    and(/^体重が(\d+)である$/, (weight: string) => {
      expect(result.weight).toBe(Number(weight));
    });
  });

  test("とくせいを正しく変換する", ({ given, when, then }) => {
    given("PokeAPIがピカチュウのレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });
    });

    when("fetchPokemonDetailをID25で呼び出す", async () => {
      result = await fetchPokemonDetail(25);
    });

    then("とくせいが正しく変換される", () => {
      expect(result.abilities).toEqual([
        { name: "static", isHidden: false },
        { name: "lightning-rod", isHidden: true },
      ]);
    });
  });

  test("名前がキャピタライズされる", ({ given, when, then }) => {
    given("PokeAPIがピカチュウのレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });
    });

    when("fetchPokemonDetailをID25で呼び出す", async () => {
      result = await fetchPokemonDetail(25);
    });

    then(/^名前が「(.*)」である$/, (name: string) => {
      expect(result.name).toBe(name);
    });
  });

  test("タイプが正しく変換される", ({ given, when, then }) => {
    given("PokeAPIがピカチュウのレスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });
    });

    when("fetchPokemonDetailをID25で呼び出す", async () => {
      result = await fetchPokemonDetail(25);
    });

    then(/^タイプが「(.*)」である$/, (type: string) => {
      expect(result.types).toEqual([type]);
    });
  });

  test("HTTPエラー時にエラーをスローする", ({ given, when, then }) => {
    given("PokeAPIが404エラーを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
    });

    when("fetchPokemonDetailをID99999で呼び出す", async () => {
      try {
        result = await fetchPokemonDetail(99999);
      } catch (e) {
        fetchError = e as Error;
      }
    });

    then(/^「(.*)」エラーがスローされる$/, (message: string) => {
      expect(fetchError).not.toBeNull();
      expect(fetchError!.message).toBe(message);
    });
  });
});
