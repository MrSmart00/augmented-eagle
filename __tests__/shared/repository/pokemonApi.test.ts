import { fetchPokemonById } from "@/src/shared/repository/pokemonApi";

const mockApiResponse = {
  id: 25,
  name: "pikachu",
  types: [
    { slot: 1, type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" } },
  ],
};

const mockMultiTypeResponse = {
  id: 1,
  name: "bulbasaur",
  types: [
    { slot: 1, type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" } },
    { slot: 2, type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" } },
  ],
};

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("fetchPokemonById", () => {
  it("正しいURLでfetchを呼び出す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    await fetchPokemonById(25);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/25"
    );
  });

  it("レスポンスをPokemon型に変換する", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await fetchPokemonById(25);

    expect(result).toEqual({
      id: 25,
      name: "Pikachu",
      types: ["electric"],
    });
  });

  it("複数タイプを正しく変換する", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMultiTypeResponse),
    });

    const result = await fetchPokemonById(1);

    expect(result).toEqual({
      id: 1,
      name: "Bulbasaur",
      types: ["grass", "poison"],
    });
  });

  it("空文字の名前が正しく処理される", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: "", types: [] }),
    });

    const result = await fetchPokemonById(1);

    expect(result.name).toBe("");
  });

  it("HTTPエラー時にエラーをスローする", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchPokemonById(99999)).rejects.toThrow(
      "Failed to fetch pokemon: 404"
    );
  });
});
