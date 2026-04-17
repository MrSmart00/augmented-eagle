Feature: お気に入りボタン

  Scenario: Lottieアニメーションコンポーネントが描画される
    Given 非お気に入り状態のFavoriteButtonを描画する
    Then Lottieアニメーションコンポーネントが存在する

  Scenario: autoPlayが無効になっている
    Given 非お気に入り状態のFavoriteButtonを描画する
    Then autoPlayがfalseである

  Scenario: ループが無効になっている
    Given 非お気に入り状態のFavoriteButtonを描画する
    Then loopがfalseである

  Scenario: ボタン押下時にonToggleが即座に呼ばれる
    Given 非お気に入り状態のFavoriteButtonを描画する
    When お気に入りボタンを押す
    Then onToggleが1回呼ばれる

  Scenario: お気に入り状態の場合、ONの最終フレームで初期表示される
    Given お気に入り状態のFavoriteButtonを描画する
    Then progressがON最終フレームの値である

  Scenario: 非お気に入り状態の場合、progressが0で初期表示される
    Given 非お気に入り状態のFavoriteButtonを描画する
    Then progressが0である

  Scenario: 外部からisFavoriteが変更された場合、progressが再同期される
    Given 非お気に入り状態のFavoriteButtonを描画する
    Then progressが0である
    When isFavoriteをtrueに変更する
    Then progressがON最終フレームの値である

  Scenario: お気に入り状態のアクセシビリティラベルが正しい
    Given お気に入り状態のFavoriteButtonを描画する
    Then アクセシビリティラベルが "favoriteButton.remove" である

  Scenario: 非お気に入り状態のアクセシビリティラベルが正しい
    Given 非お気に入り状態のFavoriteButtonを描画する
    Then アクセシビリティラベルが "favoriteButton.add" である
