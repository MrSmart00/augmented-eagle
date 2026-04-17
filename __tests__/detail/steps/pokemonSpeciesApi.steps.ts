import { defineFeature, loadFeature } from "jest-cucumber";
import { fetchPokemonFlavorText, fetchPokemonSpeciesInfo } from "@/src/detail/repository/pokemonSpeciesApi";

const feature = loadFeature(
  "__tests__/detail/features/pokemonSpeciesApi.feature"
);

const mockSpeciesResponse = {
  flavor_text_entries: [
    { flavor_text: "When several of these POKéMON gather, their electricity could build and cause lightning storms.", language: { name: "en", url: "" }, version: { name: "red", url: "" } },
    { flavor_text: "でんきを　ためこむ　せいしつ。", language: { name: "ja", url: "" }, version: { name: "red", url: "" } },
  ],
  names: [
    { name: "Pikachu", language: { name: "en", url: "" } },
    { name: "ピカチュウ", language: { name: "ja", url: "" } },
  ],
};

const mockEmptyResponse = {
  flavor_text_entries: [],
  names: [],
};

const originalFetch = globalThis.fetch;

defineFeature(feature, (test) => {
  let flavorTextResult: string | null;
  let speciesInfoResult: { localizedName: string | null; flavorText: string | null };
  let fetchError: Error | null;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
    fetchError = null;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("fetchPokemonFlavorTextが正しいURLでfetchを呼び出す", ({ given, when, then }) => {
    given("PokeAPIが種族レスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSpeciesResponse),
      });
    });

    when("fetchPokemonFlavorTextをID25で呼び出す", async () => {
      flavorTextResult = await fetchPokemonFlavorText(25);
    });

    then(/^fetchが「(.*)」で呼ばれる$/, (url: string) => {
      expect(globalThis.fetch).toHaveBeenCalledWith(url);
    });
  });

  test("英語のフレーバーテキストを返す", ({ given, when, then }) => {
    given("PokeAPIが種族レスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSpeciesResponse),
      });
    });

    when("fetchPokemonFlavorTextをID25で呼び出す", async () => {
      flavorTextResult = await fetchPokemonFlavorText(25);
    });

    then("英語のフレーバーテキストが返される", () => {
      expect(flavorTextResult).toBe("When several of these POKéMON gather, their electricity could build and cause lightning storms.");
    });
  });

  test("フレーバーテキストがない場合はnullを返す", ({ given, when, then }) => {
    given("PokeAPIが空の種族レスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEmptyResponse),
      });
    });

    when("fetchPokemonFlavorTextをID25で呼び出す", async () => {
      flavorTextResult = await fetchPokemonFlavorText(25);
    });

    then("nullが返される", () => {
      expect(flavorTextResult).toBeNull();
    });
  });

  test("fetchPokemonFlavorTextでHTTPエラー時にエラーをスローする", ({ given, when, then }) => {
    given("PokeAPIが404エラーを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
    });

    when("fetchPokemonFlavorTextをID99999で呼び出す", async () => {
      try {
        flavorTextResult = await fetchPokemonFlavorText(99999);
      } catch (e) {
        fetchError = e as Error;
      }
    });

    then(/^「(.*)」エラーがスローされる$/, (message: string) => {
      expect(fetchError).not.toBeNull();
      expect(fetchError!.message).toBe(message);
    });
  });

  test("指定した言語のポケモン名とフレーバーテキストを返す", ({ given, when, then, and }) => {
    given("PokeAPIが種族レスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSpeciesResponse),
      });
    });

    when(/^fetchPokemonSpeciesInfoをID(\d+)と言語「(.*)」で呼び出す$/, async (id: string, lang: string) => {
      speciesInfoResult = await fetchPokemonSpeciesInfo(Number(id), lang);
    });

    then(/^localizedNameが「(.*)」である$/, (name: string) => {
      expect(speciesInfoResult.localizedName).toBe(name);
    });

    and(/^flavorTextが「(.*)」である$/, (text: string) => {
      expect(speciesInfoResult.flavorText).toBe(text);
    });
  });

  test("英語を指定した場合に英語のデータを返す", ({ given, when, then, and }) => {
    given("PokeAPIが種族レスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSpeciesResponse),
      });
    });

    when(/^fetchPokemonSpeciesInfoをID(\d+)と言語「(.*)」で呼び出す$/, async (id: string, lang: string) => {
      speciesInfoResult = await fetchPokemonSpeciesInfo(Number(id), lang);
    });

    then(/^localizedNameが「(.*)」である$/, (name: string) => {
      expect(speciesInfoResult.localizedName).toBe(name);
    });

    and("flavorTextが英語である", () => {
      expect(speciesInfoResult.flavorText).toBe(
        "When several of these POKéMON gather, their electricity could build and cause lightning storms."
      );
    });
  });

  test("該当する言語がない場合はnullを返す", ({ given, when, then, and }) => {
    given("PokeAPIが空の種族レスポンスを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEmptyResponse),
      });
    });

    when(/^fetchPokemonSpeciesInfoをID(\d+)と言語「(.*)」で呼び出す$/, async (id: string, lang: string) => {
      speciesInfoResult = await fetchPokemonSpeciesInfo(Number(id), lang);
    });

    then("localizedNameがnullである", () => {
      expect(speciesInfoResult.localizedName).toBeNull();
    });

    and("flavorTextがnullである", () => {
      expect(speciesInfoResult.flavorText).toBeNull();
    });
  });

  test("fetchPokemonSpeciesInfoでHTTPエラー時にエラーをスローする", ({ given, when, then }) => {
    given("PokeAPIが404エラーを返す", () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
    });

    when(/^fetchPokemonSpeciesInfoをID(\d+)と言語「(.*)」で呼び出す$/, async (id: string, lang: string) => {
      try {
        speciesInfoResult = await fetchPokemonSpeciesInfo(Number(id), lang);
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
