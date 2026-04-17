Feature: ポケモンカード

  Scenario: ポケモンの名前が表示される
    Given ピカチュウのデータが用意されている
    When PokemonCardを描画する
    Then "ピカチュウ" が表示される

  Scenario: ポケモンの画像が正しいURLで表示される
    Given ピカチュウのデータが用意されている
    When PokemonCardを描画する
    Then 画像URLが "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" である

  Scenario: タイプバッジが翻訳されて表示される
    Given ピカチュウのデータが用意されている
    When PokemonCardを描画する
    Then "types.electric" が表示される

  Scenario: 複数タイプの場合、全てのバッジが翻訳されて表示される
    Given リザードンのデータが用意されている
    When PokemonCardを描画する
    Then "types.fire" が表示される
    And "types.flying" が表示される

  Scenario: onPressコールバックが呼ばれる
    Given ピカチュウのデータが用意されている
    When onPress付きでPokemonCardを描画する
    And カードを押す
    Then onPressが1回呼ばれる

  Scenario: onPressが未指定の場合でもエラーにならない
    Given ピカチュウのデータが用意されている
    When PokemonCardを描画する
    Then カードを押してもエラーにならない

  Scenario: isFavoriteとonToggleFavoriteが渡された場合、お気に入りボタンが表示される
    Given ピカチュウのデータが用意されている
    When お気に入り機能付きでPokemonCardを描画する
    Then お気に入りボタンが表示される

  Scenario: isFavoriteがtrueの場合、Lottieアニメーションが表示される
    Given ピカチュウのデータが用意されている
    When お気に入り状態でPokemonCardを描画する
    Then Lottieアニメーションが表示される

  Scenario: お気に入りボタン押下後アニメーション完了でonToggleFavoriteが呼ばれる
    Given ピカチュウのデータが用意されている
    When お気に入り機能付きでPokemonCardを描画する
    And お気に入りボタンを押す
    Then onToggleFavoriteが1回呼ばれる

  Scenario: isFavoriteが未指定の場合、お気に入りボタンが表示されない
    Given ピカチュウのデータが用意されている
    When PokemonCardを描画する
    Then お気に入りボタンが表示されない
