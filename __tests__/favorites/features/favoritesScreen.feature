Feature: お気に入り画面

  Scenario: お気に入りが空の場合、プレースホルダーが表示される
    Given お気に入りポケモンがない
    When お気に入り画面を表示する
    Then プレースホルダーテキストが表示される

  Scenario: ローディング中にActivityIndicatorが表示される
    Given データをローディング中である
    When お気に入り画面を表示する
    Then ローディングインジケーターが表示される

  Scenario: お気に入りのポケモンがカードとして表示される
    Given お気に入りにピカチュウが登録されている
    When お気に入り画面を表示する
    Then "Pikachu" のカードが表示される
