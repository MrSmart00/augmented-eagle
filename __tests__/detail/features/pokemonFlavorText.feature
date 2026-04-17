Feature: ポケモンフレーバーテキスト表示

  Scenario: フレーバーテキストが表示される
    Given フレーバーテキストが与えられている
    When PokemonFlavorTextをレンダリングする
    Then テキスト「でんきを　ためこむ　せいしつ。」が表示される

  Scenario: ローディング中にインジケータが表示される
    Given テキストがnullでローディング中である
    When PokemonFlavorTextをレンダリングする
    Then ローディングインジケータが表示される

  Scenario: テキストがnullでローディングでない場合は何も表示されない
    Given テキストがnullでローディングでない
    When PokemonFlavorTextをレンダリングする
    Then 何も表示されない
