Feature: ポケモン体格情報の表示

  Scenario: 身長の値が表示される
    Given 身長7、体重69のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 「0.7detail.heightUnit」が表示される

  Scenario: 体重の値が表示される
    Given 身長7、体重69のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 「6.9detail.weightUnit」が表示される

  Scenario: 身長ラベルが表示される
    Given 身長7、体重69のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 「detail.height」が表示される

  Scenario: 体重ラベルが表示される
    Given 身長7、体重69のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 「detail.weight」が表示される

  Scenario: 整数の身長が正しくフォーマットされる
    Given 身長20、体重1000のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 「2.0detail.heightUnit」が表示される
    And 「100.0detail.weightUnit」が表示される
