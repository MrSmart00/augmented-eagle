import { fetchPokemonFlavorText, fetchPokemonSpeciesInfo } from "@/src/detail/repository/pokemonSpeciesApi";

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

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("fetchPokemonFlavorText", () => {
  it("正しいURLでfetchを呼び出す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSpeciesResponse),
    });

    await fetchPokemonFlavorText(25);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon-species/25"
    );
  });

  it("英語のフレーバーテキストを返す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSpeciesResponse),
    });

    const result = await fetchPokemonFlavorText(25);

    expect(result).toBe("When several of these POKéMON gather, their electricity could build and cause lightning storms.");
  });

  it("フレーバーテキストがない場合はnullを返す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEmptyResponse),
    });

    const result = await fetchPokemonFlavorText(25);

    expect(result).toBeNull();
  });

  it("HTTPエラー時にエラーをスローする", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchPokemonFlavorText(99999)).rejects.toThrow(
      "Failed to fetch pokemon species: 404"
    );
  });
});

describe("fetchPokemonSpeciesInfo", () => {
  it("指定した言語のポケモン名とフレーバーテキストを返す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSpeciesResponse),
    });

    const result = await fetchPokemonSpeciesInfo(25, "ja");

    expect(result.localizedName).toBe("ピカチュウ");
    expect(result.flavorText).toBe("でんきを　ためこむ　せいしつ。");
  });

  it("英語を指定した場合に英語のデータを返す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSpeciesResponse),
    });

    const result = await fetchPokemonSpeciesInfo(25, "en");

    expect(result.localizedName).toBe("Pikachu");
    expect(result.flavorText).toBe(
      "When several of these POKéMON gather, their electricity could build and cause lightning storms."
    );
  });

  it("該当する言語がない場合はnullを返す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEmptyResponse),
    });

    const result = await fetchPokemonSpeciesInfo(25, "ja");

    expect(result.localizedName).toBeNull();
    expect(result.flavorText).toBeNull();
  });

  it("HTTPエラー時にエラーをスローする", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchPokemonSpeciesInfo(99999, "ja")).rejects.toThrow(
      "Failed to fetch pokemon species: 404"
    );
  });
});
