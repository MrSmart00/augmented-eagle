import { fetchPokemonList } from "@/src/home/repository/pokemonApi";
import type { PokeApiListResponse } from "@/src/home/domain/pokemonListItem";

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

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("fetchPokemonList", () => {
  it("正しいURLでfetchを呼び出す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await fetchPokemonList(20, 0);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
    );
  });

  it("レスポンスをパースして返す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchPokemonList(20, 0);

    expect(result).toEqual(mockResponse);
  });

  it("HTTPエラー時にエラーをスローする", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchPokemonList(20, 0)).rejects.toThrow(
      "Failed to fetch pokemon list: 500"
    );
  });

  it("ネットワークエラー時にエラーをスローする", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    await expect(fetchPokemonList(20, 0)).rejects.toThrow("Network error");
  });
});
