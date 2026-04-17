Feature: ホーム画面

  Scenario: ポケモンカードが表示される
    Given ポケモンリストが正常にロードされている
    When ホーム画面をレンダリングする
    Then "Pikachu" が表示される
    And "Bulbasaur" が表示される

  Scenario: 各カードが詳細画面へのリンクを持つ
    Given ポケモンリストが正常にロードされている
    When ホーム画面をレンダリングする
    Then ID 25 の詳細リンクが存在する
    And ID 1 の詳細リンクが存在する

  Scenario: FABボタンが表示される
    Given ポケモンリストが正常にロードされている
    When ホーム画面をレンダリングする
    Then FABボタンが表示される

  Scenario: FABをタップすると検索入力フィールドが表示される
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
