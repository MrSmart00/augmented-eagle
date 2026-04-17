Feature: usePokemonSpeciesInfoフック

  Scenario: 初期ロード時にisLoadingがtrueになる
    Given fetchPokemonSpeciesInfoが未解決のPromiseを返す
    When usePokemonSpeciesInfoをID25で呼び出す
    Then isLoadingがtrueである
    And localizedNameがnullである
    And flavorTextがnullである

  Scenario: ローカライズされたポケモン名とフレーバーテキストを返す
    Given fetchPokemonSpeciesInfoが日本語データを返す
    When usePokemonSpeciesInfoをID25で呼び出して完了を待つ
    Then isLoadingがfalseである
    And localizedNameが「ピカチュウ」である
    And flavorTextが「でんきを　ためこむ　せいしつ。」である
    And fetchPokemonSpeciesInfoがID25と言語「ja」で呼ばれる

  Scenario: エラー時にnullを返す
    Given fetchPokemonSpeciesInfoがエラーを返す
    When usePokemonSpeciesInfoをID25で呼び出して完了を待つ
    Then isLoadingがfalseである
    And localizedNameがnullである
    And flavorTextがnullである

  Scenario: アンマウント後にデータ取得が完了しても状態が更新されない
    Given fetchPokemonSpeciesInfoが遅延Promiseを返す
    When usePokemonSpeciesInfoをID25で呼び出してアンマウントしてからPromiseを解決する
    Then localizedNameがnullである
    And isLoadingがtrueである
