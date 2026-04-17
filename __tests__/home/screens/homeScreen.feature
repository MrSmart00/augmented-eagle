Feature: ホーム画面
  ホーム画面のUI表示とコンポーネントのテスト

  # --- ポケモンカード ---

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

  # --- フローティング検索ボタン ---

  Scenario: FloatingSearchButtonのFABボタンが表示される
    Given FloatingSearchButtonがレンダリングされている
    Then FABボタンが表示される

  Scenario: FABをタップすると検索入力が表示される
    Given FloatingSearchButtonがレンダリングされている
    When FABボタンをタップする
    Then 検索入力フィールドが表示される

  Scenario: 検索入力にテキストを入力するとonChangeTextが呼ばれる
    Given FloatingSearchButtonがレンダリングされている
    When FABボタンをタップする
    And 検索入力に "Pika" と入力する
    Then onChangeTextが "Pika" で呼ばれる

  Scenario: 閉じるボタンをタップすると折りたたまれテキストがクリアされる
    Given 検索テキスト "Pika" でFloatingSearchButtonがレンダリングされている
    When FABボタンをタップする
    And 閉じるボタンをタップする
    Then onChangeTextが "" で呼ばれる

  Scenario: プレースホルダーが表示される
    Given FloatingSearchButtonがレンダリングされている
    When FABボタンをタップする
    Then プレースホルダー "Search..." が表示される

  Scenario: キーボードが閉じたらFABボタンに戻る
    Given FloatingSearchButtonがレンダリングされている
    When FABボタンをタップする
    And キーボードが閉じられる
    Then onChangeTextが "" で呼ばれる
    And FABボタンが表示される

  # --- ホーム画面統合 ---

  Scenario: ホーム画面にポケモンカードが表示される
    Given ポケモンリストが正常にロードされている
    When ホーム画面をレンダリングする
    Then "Pikachu" が表示される
    And "Bulbasaur" が表示される

  Scenario: 各カードが詳細画面へのリンクを持つ
    Given ポケモンリストが正常にロードされている
    When ホーム画面をレンダリングする
    Then ID 25 の詳細リンクが存在する
    And ID 1 の詳細リンクが存在する

  Scenario: ホーム画面にFABボタンが表示される
    Given ポケモンリストが正常にロードされている
    When ホーム画面をレンダリングする
    Then FABボタンが表示される

  Scenario: ホーム画面でFABをタップすると検索入力フィールドが表示される
    Given ポケモンリストが正常にロードされている
    When ホーム画面をレンダリングする
    And FABボタンをタップする
    Then 検索入力フィールドが表示される

  Scenario: 検索テキスト入力でポケモンがフィルタリングされる
    Given ポケモンリストが正常にロードされている
    When ホーム画面をレンダリングする
    And FABボタンをタップする
    And 検索入力に "Pika" と入力する
    Then "Pikachu" が表示される
    And "Bulbasaur" は表示されない

  Scenario: 各カードにお気に入りボタンが表示される
    Given ポケモンリストが正常にロードされている
    When ホーム画面をレンダリングする
    Then お気に入りボタンが表示される

  Scenario: ローディング中にActivityIndicatorが表示される
    Given ポケモンリストがローディング中である
    When ホーム画面をレンダリングする
    Then ローディングインジケーターが表示される

  Scenario: エラー時にエラーメッセージが表示される
    Given ポケモンリストの取得でエラーが発生している
    When ホーム画面をレンダリングする
    Then エラーメッセージが表示される
