Feature: ポケモンとくせい表示

  Scenario: セクションタイトルが表示される
    Given とくせいリストが与えられている
    When PokemonAbilitiesをレンダリングする
    Then セクションタイトル「detail.abilities」が表示される

  Scenario: とくせい名がキャピタライズされて表示される
    Given とくせいリストが与えられている
    When PokemonAbilitiesをレンダリングする
    Then とくせい名「Overgrow」が表示される

  Scenario: 隠れとくせいにラベルが付与される
    Given とくせいリストが与えられている
    When PokemonAbilitiesをレンダリングする
    Then 隠れとくせい「Chlorophyll detail.hiddenAbility」が表示される

  Scenario: 複数のとくせいが全て表示される
    Given とくせいリストが与えられている
    When PokemonAbilitiesをレンダリングする
    Then とくせい名「Overgrow」が表示される
    And 隠れとくせい「Chlorophyll detail.hiddenAbility」が表示される
