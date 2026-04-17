Feature: IDリストによるポケモン取得フック

  Scenario: 空配列の場合はローディングせず空配列を返す
    Given IDリストが空配列である
    When フックをレンダーする
    Then isLoadingはfalseである
    And pokemonは空配列である

  Scenario: 複数IDのポケモンを並列取得する
    Given ID 25 と 1 のポケモンデータが存在する
    When IDリスト [25, 1] でフックをレンダーする
    Then ローディング完了後にポケモンが2件取得される
    And fetchPokemonByIdが2回呼ばれる
    And fetchPokemonSpeciesInfoが2回呼ばれる

  Scenario: ローカライズ名がある場合はローカライズ名を使用する
    Given ID 25 のポケモンにローカライズ名 "ピカチュウ" が存在する
    When IDリスト [25] でフックをレンダーする
    Then ポケモンの名前は "ピカチュウ" である

  Scenario: ローカライズ名がnullの場合は英語名にフォールバックする
    Given ID 25 のポケモンにローカライズ名がnullである
    When IDリスト [25] でフックをレンダーする
    Then ポケモンの名前は "Pikachu" である

  Scenario: 現在の言語をfetchPokemonSpeciesInfoに渡す
    Given ID 25 のポケモンデータが存在する
    When IDリスト [25] でフックをレンダーする
    Then fetchPokemonSpeciesInfoにID 25 と言語 "ja" が渡される

  Scenario: 一部取得に失敗してもエラーが設定される
    Given ID 25 のポケモンは取得成功しID 999 は取得失敗する
    When IDリスト [25, 999] でフックをレンダーする
    Then エラーメッセージは "Not found" である

  Scenario: Error以外のエラーでもerror状態が設定される
    Given ID 25 のポケモン取得が文字列エラーで失敗する
    When IDリスト [25] でフックをレンダーする
    Then エラーメッセージは "Unknown error" である

  Scenario: アンマウント後にデータ取得が完了しても状態が更新されない
    Given ID 25 のポケモン取得が未解決のPromiseを返す
    When IDリスト [25] でフックをレンダーしてアンマウントする
    Then pokemonは空配列のままである
    And isLoadingはtrueのままである

  Scenario: IDリストが変わると再取得する
    Given ID 25 と 1 のポケモンデータが存在する
    When IDリスト [25] でフックをレンダーし、その後 [25, 1] に変更する
    Then ポケモンが2件取得される
