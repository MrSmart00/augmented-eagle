import { fetchPokemonDetail } from "@/src/modules/detail/repository/pokemonDetailApi";

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

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("fetchPokemonDetail", () => {
  it("正しいURLでfetchを呼び出す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    await fetchPokemonDetail(25);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/25"
    );
  });

  it("レスポンスからステータスを正しく変換する", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await fetchPokemonDetail(25);

    expect(result.stats).toEqual([
      { name: "hp", baseStat: 35 },
      { name: "attack", baseStat: 55 },
      { name: "defense", baseStat: 40 },
      { name: "special-attack", baseStat: 50 },
      { name: "special-defense", baseStat: 50 },
      { name: "speed", baseStat: 90 },
    ]);
  });

  it("身長と体重を正しく変換する", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await fetchPokemonDetail(25);

    expect(result.height).toBe(4);
    expect(result.weight).toBe(60);
  });

  it("とくせいを正しく変換する", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await fetchPokemonDetail(25);

    expect(result.abilities).toEqual([
      { name: "static", isHidden: false },
      { name: "lightning-rod", isHidden: true },
    ]);
  });

  it("名前がキャピタライズされる", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await fetchPokemonDetail(25);

    expect(result.name).toBe("Pikachu");
  });

  it("タイプが正しく変換される", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await fetchPokemonDetail(25);

    expect(result.types).toEqual(["electric"]);
  });

  it("HTTPエラー時にエラーをスローする", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchPokemonDetail(99999)).rejects.toThrow(
      "Failed to fetch pokemon detail: 404"
    );
  });
});
