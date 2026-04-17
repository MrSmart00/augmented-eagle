Feature: ポケモンステータス表示

  Scenario: セクションタイトルが表示される
    Given ステータスデータが与えられている
    When PokemonStatsをレンダリングする
    Then 「detail.baseStats」が表示される

  Scenario: 6つのステータスバーが表示される
    Given ステータスデータが与えられている
    When PokemonStatsをレンダリングする
    Then 「detail.stats.hp」が表示される
    And 「detail.stats.attack」が表示される
    And 「detail.stats.defense」が表示される
    And 「detail.stats.special-attack」が表示される
    And 「detail.stats.special-defense」が表示される
    And 「detail.stats.speed」が表示される

  Scenario: 各ステータスの値が正しく表示される
    Given ステータスデータが与えられている
    When PokemonStatsをレンダリングする
    Then 値「45」が2つ表示される
    And 値「49」が2つ表示される
    And 値「65」が2つ表示される
