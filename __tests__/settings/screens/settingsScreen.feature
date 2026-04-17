Feature: 設定画面

  Scenario: 日本語と英語の選択肢が表示される
    Given 現在の言語が "ja" である
    When 言語選択コンポーネントを表示する
    Then 日本語の選択肢が表示される
    And 英語の選択肢が表示される

  Scenario: 現在の言語にチェックマークが表示される
    Given 現在の言語が "ja" である
    When 言語選択コンポーネントを表示する
    Then 日本語にチェックマークが表示される
    And 英語にチェックマークが表示されない

  Scenario: 言語を選択するとchangeLanguageが呼ばれる
    Given 現在の言語が "ja" である
    When 英語の選択肢をタップする
    Then changeLanguageが "en" で呼ばれる
