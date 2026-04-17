Feature: ポケモンGraphQL API

  Scenario: GraphQLエンドポイントにPOSTリクエストを送信する
    Given fetchがモックされている
    And fetchがGraphQL正常レスポンスを返す
    When fetchPokemonListGraphQLを limit 20 offset 0 lang "ja" で呼び出す
    Then fetchが "https://beta.pokeapi.co/graphql/v1beta" にPOSTで呼ばれる

  Scenario: ローカライズされたポケモン名とタイプを返す
    Given fetchがモックされている
    And fetchがGraphQL正常レスポンスを返す
    When fetchPokemonListGraphQLを limit 20 offset 0 lang "ja" で呼び出す
    Then 総件数は 1025 である
    And ポケモンの件数は 2 である
    And 1番目のポケモンはID 1 名前 "フシギダネ" タイプ "grass,poison" である
    And 2番目のポケモンはID 4 名前 "ヒトカゲ" タイプ "fire" である

  Scenario: ローカライズ名がない場合はspecies名にフォールバックする
    Given fetchがモックされている
    And fetchがローカライズ名なしのGraphQLレスポンスを返す
    When fetchPokemonListGraphQLを limit 20 offset 0 lang "ja" で呼び出す
    Then 1番目のポケモンの名前は "Bulbasaur" である

  Scenario: HTTPエラー時にエラーをスローする
    Given fetchがモックされている
    And fetchがステータス 500 のHTTPエラーを返す
    When fetchPokemonListGraphQLを limit 20 offset 0 lang "ja" で呼び出す
    Then "GraphQL request failed: 500" エラーがスローされる

  Scenario: GraphQLエラー時にエラーをスローする
    Given fetchがモックされている
    And fetchがGraphQLエラーレスポンスを返す
    When fetchPokemonListGraphQLを limit 20 offset 0 lang "ja" で呼び出す
    Then "GraphQL error: Field not found" エラーがスローされる
