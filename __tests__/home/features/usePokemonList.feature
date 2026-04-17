Feature: usePokemonListフック

  Scenario: 初期ロード時にisLoadingがtrueになる
    Given fetchPokemonListGraphQLが未解決のPromiseを返す
    When usePokemonListフックがレンダリングされる
    Then isLoadingはtrueである

  Scenario: データ取得後にポケモン一覧が設定される
    Given fetchPokemonListGraphQLがオフセット0で総数40のデータを返す
    When usePokemonListフックがレンダリングされる
    And ローディングが完了する
    Then ポケモン一覧の件数は2件である
    And 1番目のポケモンの名前は "ポケモン1" である
    And 1番目のポケモンのIDは 1 である
    And 1番目のポケモンのタイプは "grass" を含む

  Scenario: 言語パラメータがGraphQL関数に渡される
    Given fetchPokemonListGraphQLがオフセット0で総数40のデータを返す
    When usePokemonListフックがレンダリングされる
    And ローディングが完了する
    Then fetchPokemonListGraphQLが 20 と 0 と "ja" で呼ばれる

  Scenario: loadMoreで追加データが追加される
    Given fetchPokemonListGraphQLがオフセット0で総数40のデータを返す
    When usePokemonListフックがレンダリングされる
    And ローディングが完了する
    And fetchPokemonListGraphQLがオフセット20で総数40の追加データを返す
    And loadMoreを実行する
    Then ポケモン一覧の件数は4件である

  Scenario: 総件数に達した場合hasMoreがfalseになる
    Given fetchPokemonListGraphQLがオフセット0で総数2のデータを返す
    When usePokemonListフックがレンダリングされる
    And ローディングが完了する
    Then hasMoreはfalseである

  Scenario: hasMoreがfalseの場合loadMoreは何もしない
    Given fetchPokemonListGraphQLがオフセット0で総数2のデータを返す
    When usePokemonListフックがレンダリングされる
    And ローディングが完了する
    And loadMoreを実行する
    Then fetchPokemonListGraphQLは1回だけ呼ばれる

  Scenario: refreshでデータがリセットされる
    Given fetchPokemonListGraphQLがオフセット0で総数40のデータを返す
    When usePokemonListフックがレンダリングされる
    And ローディングが完了する
    And fetchPokemonListGraphQLがオフセット0で総数40のリフレッシュデータを返す
    And refreshを実行する
    Then ポケモン一覧の件数は2件である
    And fetchPokemonListGraphQLは2回呼ばれる
    And 最後のfetchPokemonListGraphQL呼び出しは 20 と 0 と "ja" である

  Scenario: エラー時にerror状態が設定される
    Given fetchPokemonListGraphQLが "Network error" エラーを返す
    When usePokemonListフックがレンダリングされる
    And ローディングが完了する
    Then errorは "Network error" である

  Scenario: 初期ロードでError以外のエラーでもerror状態が設定される
    Given fetchPokemonListGraphQLが文字列エラーを返す
    When usePokemonListフックがレンダリングされる
    And ローディングが完了する
    Then errorは "Unknown error" である

  Scenario: loadMoreでError以外のエラーでもerror状態が設定される
    Given fetchPokemonListGraphQLがオフセット0で総数40のデータを返す
    When usePokemonListフックがレンダリングされる
    And ローディングが完了する
    And fetchPokemonListGraphQLが文字列エラーを返すよう設定する
    And loadMoreを実行する
    Then errorは "Unknown error" である
