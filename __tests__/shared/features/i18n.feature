Feature: 国際化（i18n）

  Scenario: デフォルト言語が日本語で初期化される
    Given AsyncStorageが空である
    When i18nを初期化する
    Then 言語が "ja" である

  Scenario: AsyncStorageに保存された言語で初期化される
    Given AsyncStorageに言語 "en" が保存されている
    When i18nを初期化する
    Then 言語が "en" である

  Scenario: 不正な言語が保存されていた場合はデフォルトの日本語で初期化される
    Given AsyncStorageに言語 "fr" が保存されている
    When i18nを初期化する
    Then 言語が "ja" である

  Scenario: 日本語の翻訳キーが正しく解決される
    Given i18nが初期化されている
    Then 翻訳キー "tabs.pokedex" が "ポケモン図鑑" に解決される
    And 翻訳キー "favorites.empty" が "お気に入りのポケモンはまだいません" に解決される

  Scenario: 英語に切り替えると英語の翻訳が返される
    Given i18nが初期化されている
    When 言語を "en" に切り替える
    Then 翻訳キー "tabs.pokedex" が "Pokédex" に解決される
    And 翻訳キー "favorites.empty" が "No favorite Pokémon yet" に解決される

  Scenario: 日本語に戻すと日本語の翻訳が返される
    Given i18nが初期化されている
    When 言語を "en" に切り替える
    And 言語を "ja" に切り替える
    Then 翻訳キー "tabs.pokedex" が "ポケモン図鑑" に解決される

  Scenario: SUPPORTED_LANGUAGESに日本語と英語が含まれる
    Then SUPPORTED_LANGUAGESが "ja" と "en" を含む
