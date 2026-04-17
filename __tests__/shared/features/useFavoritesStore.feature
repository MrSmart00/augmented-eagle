Feature: お気に入りストア

  Scenario: 初期状態ではお気に入りが空である
    Given お気に入りストアが初期状態である
    When useFavoritesフックを実行する
    Then お気に入りリストが空である

  Scenario: toggleFavoriteでポケモンをお気に入りに追加できる
    Given お気に入りストアが初期状態である
    When useFavoritesフックを実行する
    And ポケモンID 25 をトグルする
    Then お気に入りリストに 25 が含まれる

  Scenario: toggleFavoriteで既にお気に入りのポケモンを削除できる
    Given お気に入りストアが初期状態である
    When useFavoritesフックを実行する
    And ポケモンID 25 をトグルする
    And ポケモンID 25 をトグルする
    Then お気に入りリストが空である

  Scenario: isFavoriteがお気に入り登録済みのポケモンに対してtrueを返す
    Given お気に入りストアが初期状態である
    When useFavoritesフックを実行する
    And ポケモンID 25 をトグルする
    Then ポケモンID 25 がお気に入りである

  Scenario: isFavoriteが未登録のポケモンに対してfalseを返す
    Given お気に入りストアが初期状態である
    When useFavoritesフックを実行する
    Then ポケモンID 25 がお気に入りでない

  Scenario: お気に入りが6匹に達している場合、追加できずアラートが表示される
    Given お気に入りストアが初期状態である
    When useFavoritesフックを実行する
    And 6匹のポケモンをお気に入りに追加する
    And ポケモンID 7 をトグルする
    Then お気に入りの数が 6 である
    And お気に入りリストに 7 が含まれない
    And アラートが表示される

  Scenario: 上限に達していても既存のお気に入りは削除できる
    Given お気に入りストアが初期状態である
    When useFavoritesフックを実行する
    And 6匹のポケモンをお気に入りに追加する
    And ポケモンID 3 をトグルする
    Then お気に入りの数が 5 である
    And お気に入りリストに 3 が含まれない

  Scenario: isFullが上限到達時にtrueを返す
    Given お気に入りストアが初期状態である
    When useFavoritesフックを実行する
    Then isFullがfalseである
    When 6匹のポケモンをお気に入りに追加する
    Then isFullがtrueである
