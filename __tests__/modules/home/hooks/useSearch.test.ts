import { renderHook, act } from "@testing-library/react-native";
import { useSearch } from "@/src/modules/home";
import type { Pokemon } from "@/src/modules/home";

const mockPokemon: Pokemon[] = [
  { id: 1, name: "フシギダネ", types: ["grass", "poison"] },
  { id: 4, name: "ヒトカゲ", types: ["fire"] },
  { id: 7, name: "ゼニガメ", types: ["water"] },
  { id: 25, name: "ピカチュウ", types: ["electric"] },
];

describe("useSearch", () => {
  it("初期状態では全てのポケモンが返される", () => {
    const { result } = renderHook(() => useSearch(mockPokemon));
    expect(result.current.filteredItems).toEqual(mockPokemon);
    expect(result.current.searchText).toBe("");
  });

  it("検索テキストに一致するポケモンのみがフィルタリングされる", () => {
    const { result } = renderHook(() => useSearch(mockPokemon));
    act(() => {
      result.current.setSearchText("ピカチュウ");
    });
    expect(result.current.filteredItems).toEqual([
      { id: 25, name: "ピカチュウ", types: ["electric"] },
    ]);
  });

  it("検索テキストが空文字の場合は全てのポケモンが返される", () => {
    const { result } = renderHook(() => useSearch(mockPokemon));
    act(() => {
      result.current.setSearchText("ピカ");
    });
    act(() => {
      result.current.setSearchText("");
    });
    expect(result.current.filteredItems).toEqual(mockPokemon);
  });

  it("一致するポケモンがない場合は空配列が返される", () => {
    const { result } = renderHook(() => useSearch(mockPokemon));
    act(() => {
      result.current.setSearchText("ミュウツー");
    });
    expect(result.current.filteredItems).toEqual([]);
  });

  it("検索テキストが部分一致でもフィルタリングされる", () => {
    const { result } = renderHook(() => useSearch(mockPokemon));
    act(() => {
      result.current.setSearchText("ガメ");
    });
    expect(result.current.filteredItems).toEqual([
      { id: 7, name: "ゼニガメ", types: ["water"] },
    ]);
  });
});
