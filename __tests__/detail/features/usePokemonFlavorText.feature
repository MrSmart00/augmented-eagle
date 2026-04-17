Feature: usePokemonFlavorTextフック

  Scenario: 初期ロード時にisLoadingがtrueになる
    Given fetchPokemonFlavorTextが未解決のPromiseを返す
    When usePokemonFlavorTextをID25で呼び出す
    Then isLoadingがtrueである
    And flavorTextがnullである

  Scenario: データ取得後にフレーバーテキストが設定される
    Given fetchPokemonFlavorTextがテキストを返す
    When usePokemonFlavorTextをID25で呼び出して完了を待つ
    Then isLoadingがfalseである
    And flavorTextが「でんきを　ためこむ　せいしつ。」である

  Scenario: エラー時はflavorTextがnullのままになる
    Given fetchPokemonFlavorTextがエラーを返す
    When usePokemonFlavorTextをID25で呼び出して完了を待つ
    Then isLoadingがfalseである
    And flavorTextがnullである

  Scenario: アンマウント後にデータ取得が完了しても状態が更新されない
    Given fetchPokemonFlavorTextが遅延Promiseを返す
    When usePokemonFlavorTextをID25で呼び出してアンマウントしてからPromiseを解決する
    Then flavorTextがnullである
    And isLoadingがtrueである
