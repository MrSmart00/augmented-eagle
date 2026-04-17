Feature: usePokemonDetailフック

  Scenario: 初期ロード時にisLoadingがtrueになる
    Given fetchPokemonDetailが未解決のPromiseを返す
    When usePokemonDetailをID25で呼び出す
    Then isLoadingがtrueである
    And pokemonがnullである

  Scenario: データ取得後にポケモン詳細が設定される
    Given fetchPokemonDetailがピカチュウのデータを返す
    When usePokemonDetailをID25で呼び出して完了を待つ
    Then isLoadingがfalseである
    And ポケモン詳細データが設定される
    And fetchPokemonDetailがID25で呼ばれる

  Scenario: エラー時にerror状態が設定される
    Given fetchPokemonDetailがエラー「Not found」を返す
    When usePokemonDetailをID25で呼び出して完了を待つ
    Then isLoadingがfalseである
    And errorが「Not found」である
    And pokemonがnullである

  Scenario: Error以外のエラーでもerror状態が設定される
    Given fetchPokemonDetailが文字列エラーを返す
    When usePokemonDetailをID25で呼び出して完了を待つ
    Then isLoadingがfalseである
    And errorが「Unknown error」である

  Scenario: アンマウント後にデータ取得が完了しても状態が更新されない
    Given fetchPokemonDetailが遅延Promiseを返す
    When usePokemonDetailをID25で呼び出してアンマウントしてからPromiseを解決する
    Then pokemonがnullである
    And isLoadingがtrueである

  Scenario: IDが変わると再取得する
    Given fetchPokemonDetailがピカチュウのデータを返す
    When usePokemonDetailをID25で呼び出して完了後にID1に変更する
    Then 新しいポケモンデータが設定される
