Feature: ポケモンリストアイテムの変換
  PokeAPIのレスポンスをアプリ内のPokemonSummary型に変換する

  Scenario Outline: URLからポケモンIDを抽出する
    Given PokeAPIのURL "<url>" が与えられている
    When URLからIDを抽出する
    Then IDは <id> である

    Examples:
      | url                                    | id  |
      | https://pokeapi.co/api/v2/pokemon/25/  | 25  |
      | https://pokeapi.co/api/v2/pokemon/151/ | 151 |
      | https://pokeapi.co/api/v2/pokemon/1    | 1   |

  Scenario Outline: ポケモン名を先頭大文字化する
    Given ポケモン名 "<input>" が与えられている
    When 名前を先頭大文字化する
    Then 結果は "<expected>" である

    Examples:
      | input     | expected  |
      | bulbasaur | Bulbasaur |
      |           |           |

  Scenario: PokeApiListItemをPokemonSummary型に変換する
    Given PokeAPIリストアイテムの名前が "pikachu" でURLが "https://pokeapi.co/api/v2/pokemon/25/" である
    When PokemonSummary型に変換する
    Then IDは 25 である
    And 名前は "Pikachu" である
    And typesは空配列である
