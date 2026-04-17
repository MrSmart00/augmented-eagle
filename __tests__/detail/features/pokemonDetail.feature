Feature: ポケモン詳細コンポーネント

  Scenario: ローカライズ名が渡された場合に表示される
    Given ピカチュウのデータが用意されている
    When ローカライズ名「ピカチュウ」を指定してPokemonDetailをレンダリングする
    Then 「ピカチュウ」が表示される

  Scenario: ローカライズ名がnullの場合はAPI名が表示される
    Given ピカチュウのデータが用意されている
    When ローカライズ名をnullにしてPokemonDetailをレンダリングする
    Then 「pikachu」が表示される

  Scenario: ポケモンのIDが3桁ゼロ埋めで表示される
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then 「#025」が表示される

  Scenario: ポケモンの画像が表示される
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then ポケモン画像のURIに「25.png」が含まれる

  Scenario: タイプバッジが翻訳されて表示される
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then 「types.electric」が表示される

  Scenario: 複数タイプが翻訳されて全て表示される
    Given リザードンのデータが用意されている
    When PokemonDetailをレンダリングする
    Then 「types.fire」が表示される
    And 「types.flying」が表示される

  Scenario: お気に入りボタンが表示される
    Given ピカチュウのデータが用意されている
    When お気に入り機能付きでPokemonDetailをレンダリングする
    Then お気に入りボタンが表示される

  Scenario: お気に入りボタン押下後にonToggleFavoriteが呼ばれる
    Given ピカチュウのデータが用意されている
    When お気に入り機能付きでPokemonDetailをレンダリングしてボタンを押す
    Then onToggleFavoriteが1回呼ばれる

  Scenario: お気に入りが未指定の場合ボタンが表示されない
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then お気に入りボタンが表示されない

  Scenario: フレーバーテキストが渡された場合に表示される
    Given ピカチュウのデータが用意されている
    When フレーバーテキスト付きでPokemonDetailをレンダリングする
    Then フレーバーテキストが表示される

  Scenario: フレーバーテキストが未指定の場合は表示されない
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then フレーバーテキストのローディングが表示されない
