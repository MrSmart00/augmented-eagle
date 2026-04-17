import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, act } from "@testing-library/react-native";
import { useSearch } from "@/src/home";
import type { PokemonSummary } from "@/src/shared";

const feature = loadFeature("__tests__/home/features/useSearch.feature");

const mockPokemon: PokemonSummary[] = [
  { id: 1, name: "フシギダネ", types: ["grass", "poison"] },
  { id: 4, name: "ヒトカゲ", types: ["fire"] },
  { id: 7, name: "ゼニガメ", types: ["water"] },
  { id: 25, name: "ピカチュウ", types: ["electric"] },
];

defineFeature(feature, (test) => {
  let result: { current: ReturnType<typeof useSearch> };

  test("初期状態では全てのポケモンが返される", ({ given, when, then, and }) => {
    given("ポケモンリストが用意されている", () => {
      // mockPokemon is already defined
    });

    when("useSearchフックがレンダリングされる", () => {
      const hook = renderHook(() => useSearch(mockPokemon));
      result = hook.result;
    });

    then("全てのポケモンが返される", () => {
      expect(result.current.filteredItems).toEqual(mockPokemon);
    });

    and("検索テキストは空文字である", () => {
      expect(result.current.searchText).toBe("");
    });
  });

  test("検索テキストに一致するポケモンのみがフィルタリングされる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ポケモンリストが用意されている", () => {
      // mockPokemon is already defined
    });

    when("useSearchフックがレンダリングされる", () => {
      const hook = renderHook(() => useSearch(mockPokemon));
      result = hook.result;
    });

    and(/^検索テキストを "(.*)" に設定する$/, (text: string) => {
      act(() => {
        result.current.setSearchText(text);
      });
    });

    then("フィルタリング結果にはIDが25のピカチュウのみが含まれる", () => {
      expect(result.current.filteredItems).toEqual([
        { id: 25, name: "ピカチュウ", types: ["electric"] },
      ]);
    });
  });

  test("検索テキストが空文字の場合は全てのポケモンが返される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ポケモンリストが用意されている", () => {
      // mockPokemon is already defined
    });

    when("useSearchフックがレンダリングされる", () => {
      const hook = renderHook(() => useSearch(mockPokemon));
      result = hook.result;
    });

    and(/^検索テキストを "(.*)" に設定する$/, (text: string) => {
      act(() => {
        result.current.setSearchText(text);
      });
    });

    and(/^検索テキストを "(.*)" に設定する$/, (text: string) => {
      act(() => {
        result.current.setSearchText(text);
      });
    });

    then("全てのポケモンが返される", () => {
      expect(result.current.filteredItems).toEqual(mockPokemon);
    });
  });

  test("一致するポケモンがない場合は空配列が返される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ポケモンリストが用意されている", () => {
      // mockPokemon is already defined
    });

    when("useSearchフックがレンダリングされる", () => {
      const hook = renderHook(() => useSearch(mockPokemon));
      result = hook.result;
    });

    and(/^検索テキストを "(.*)" に設定する$/, (text: string) => {
      act(() => {
        result.current.setSearchText(text);
      });
    });

    then("フィルタリング結果は空配列である", () => {
      expect(result.current.filteredItems).toEqual([]);
    });
  });

  test("検索テキストが部分一致でもフィルタリングされる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ポケモンリストが用意されている", () => {
      // mockPokemon is already defined
    });

    when("useSearchフックがレンダリングされる", () => {
      const hook = renderHook(() => useSearch(mockPokemon));
      result = hook.result;
    });

    and(/^検索テキストを "(.*)" に設定する$/, (text: string) => {
      act(() => {
        result.current.setSearchText(text);
      });
    });

    then("フィルタリング結果にはIDが7のゼニガメのみが含まれる", () => {
      expect(result.current.filteredItems).toEqual([
        { id: 7, name: "ゼニガメ", types: ["water"] },
      ]);
    });
  });
});
