import { fetchPokemonById } from "@/src/shared";

const mockPokemonApiResponse = {
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

describe("pokemonApi", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("正しいURLでfetchを呼び出す", async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonApiResponse),
    });
    await fetchPokemonById(25);
    expect(globalThis.fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/25");
  });

  it("レスポンスをPokemon型に変換する", async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonApiResponse),
    });
    const result = await fetchPokemonById(25);
    expect(result).toEqual({
      id: 25,
      name: "Pikachu",
      types: ["electric"],
    });
  });

  it("複数タイプを正しく変換する", async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
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
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: "", types: [] }),
    });
    const result = await fetchPokemonById(1);
    expect(result.name).toBe("");
  });

  it("HTTPエラー時にエラーをスローする", async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
    await expect(fetchPokemonById(99999)).rejects.toThrow("Failed to fetch pokemon: 404");
  });
});
