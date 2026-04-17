Feature: ポケモン詳細API

  Scenario: 正しいURLでfetchを呼び出す
    Given PokeAPIがピカチュウのレスポンスを返す
    When fetchPokemonDetailをID25で呼び出す
    Then fetchが「https://pokeapi.co/api/v2/pokemon/25」で呼ばれる

  Scenario: レスポンスからステータスを正しく変換する
    Given PokeAPIがピカチュウのレスポンスを返す
    When fetchPokemonDetailをID25で呼び出す
    Then ステータスが正しく変換される

  Scenario: 身長と体重を正しく変換する
    Given PokeAPIがピカチュウのレスポンスを返す
    When fetchPokemonDetailをID25で呼び出す
    Then 身長が4である
    And 体重が60である

  Scenario: とくせいを正しく変換する
    Given PokeAPIがピカチュウのレスポンスを返す
    When fetchPokemonDetailをID25で呼び出す
    Then とくせいが正しく変換される

  Scenario: 名前がキャピタライズされる
    Given PokeAPIがピカチュウのレスポンスを返す
    When fetchPokemonDetailをID25で呼び出す
    Then 名前が「Pikachu」である

  Scenario: タイプが正しく変換される
    Given PokeAPIがピカチュウのレスポンスを返す
    When fetchPokemonDetailをID25で呼び出す
    Then タイプが「electric」である

  Scenario: HTTPエラー時にエラーをスローする
    Given PokeAPIが404エラーを返す
    When fetchPokemonDetailをID99999で呼び出す
    Then 「Failed to fetch pokemon detail: 404」エラーがスローされる
