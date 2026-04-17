Feature: ポケモンAPI

  Scenario: 正しいURLでfetchを呼び出す
    Given fetchがモックされている
    When ポケモンID 25 で取得する
    Then fetchが "https://pokeapi.co/api/v2/pokemon/25" で呼ばれる

  Scenario: レスポンスをPokemon型に変換する
    Given 単一タイプのAPIレスポンスが返される
    When ポケモンID 25 で取得する
    Then IDが 25 で名前が "Pikachu" でタイプが "electric" のPokemonが返される

  Scenario: 複数タイプを正しく変換する
    Given 複数タイプのAPIレスポンスが返される
    When ポケモンID 1 で取得する
    Then IDが 1 で名前が "Bulbasaur" でタイプが "grass,poison" のPokemonが返される

  Scenario: 空文字の名前が正しく処理される
    Given 空の名前のAPIレスポンスが返される
    When ポケモンID 1 で取得する
    Then 名前が空文字である

  Scenario: HTTPエラー時にエラーをスローする
    Given HTTPエラー 404 が返される
    When ポケモンID 99999 で取得する
    Then "Failed to fetch pokemon: 404" エラーがスローされる
