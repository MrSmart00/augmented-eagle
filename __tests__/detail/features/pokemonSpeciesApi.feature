Feature: ポケモン種族API

  Scenario: fetchPokemonFlavorTextが正しいURLでfetchを呼び出す
    Given PokeAPIが種族レスポンスを返す
    When fetchPokemonFlavorTextをID25で呼び出す
    Then fetchが「https://pokeapi.co/api/v2/pokemon-species/25」で呼ばれる

  Scenario: 英語のフレーバーテキストを返す
    Given PokeAPIが種族レスポンスを返す
    When fetchPokemonFlavorTextをID25で呼び出す
    Then 英語のフレーバーテキストが返される

  Scenario: フレーバーテキストがない場合はnullを返す
    Given PokeAPIが空の種族レスポンスを返す
    When fetchPokemonFlavorTextをID25で呼び出す
    Then nullが返される

  Scenario: fetchPokemonFlavorTextでHTTPエラー時にエラーをスローする
    Given PokeAPIが404エラーを返す
    When fetchPokemonFlavorTextをID99999で呼び出す
    Then 「Failed to fetch pokemon species: 404」エラーがスローされる

  Scenario: 指定した言語のポケモン名とフレーバーテキストを返す
    Given PokeAPIが種族レスポンスを返す
    When fetchPokemonSpeciesInfoをID25と言語「ja」で呼び出す
    Then localizedNameが「ピカチュウ」である
    And flavorTextが「でんきを　ためこむ　せいしつ。」である

  Scenario: 英語を指定した場合に英語のデータを返す
    Given PokeAPIが種族レスポンスを返す
    When fetchPokemonSpeciesInfoをID25と言語「en」で呼び出す
    Then localizedNameが「Pikachu」である
    And flavorTextが英語である

  Scenario: 該当する言語がない場合はnullを返す
    Given PokeAPIが空の種族レスポンスを返す
    When fetchPokemonSpeciesInfoをID25と言語「ja」で呼び出す
    Then localizedNameがnullである
    And flavorTextがnullである

  Scenario: fetchPokemonSpeciesInfoでHTTPエラー時にエラーをスローする
    Given PokeAPIが404エラーを返す
    When fetchPokemonSpeciesInfoをID99999と言語「ja」で呼び出す
    Then 「Failed to fetch pokemon species: 404」エラーがスローされる
