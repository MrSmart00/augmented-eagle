Feature: useLanguageフック

  Scenario: 現在の言語を返す
    Given i18nが初期化されている
    When useLanguageフックを実行する
    Then 言語が "ja" である

  Scenario: 言語を変更するとi18nextの言語が更新される
    Given i18nが初期化されている
    When useLanguageフックを実行する
    And 言語を "en" に変更する
    Then 言語が "en" である

  Scenario: 言語変更がAsyncStorageに保存される
    Given i18nが初期化されている
    When useLanguageフックを実行する
    And 言語を "en" に変更する
    Then AsyncStorageに "en" が保存されている
