Feature: ポケモンREST API

  Scenario: 正しいURLでfetchを呼び出す
    Given fetchがモックされている
    And fetchが正常なレスポンスを返す
    When fetchPokemonListを limit 20 offset 0 で呼び出す
    Then fetchが "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0" で呼ばれる

  Scenario: レスポンスをパースして返す
    Given fetchがモックされている
    And fetchが正常なレスポンスを返す
    When fetchPokemonListを limit 20 offset 0 で呼び出す
    Then レスポンスがパースされて返される

  Scenario: HTTPエラー時にエラーをスローする
    Given fetchがモックされている
    And fetchがステータス 500 のエラーレスポンスを返す
    When fetchPokemonListを limit 20 offset 0 で呼び出す
    Then "Failed to fetch pokemon list: 500" エラーがスローされる

  Scenario: ネットワークエラー時にエラーをスローする
    Given fetchがモックされている
    And fetchが "Network error" ネットワークエラーを返す
    When fetchPokemonListを limit 20 offset 0 で呼び出す
    Then "Network error" エラーがスローされる
