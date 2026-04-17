Feature: ポケモン詳細画面

  # ============================================================
  # DetailScreen（画面統合テスト）
  # ============================================================

  Scenario: ローカライズされたポケモン名が表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then 「ピカチュウ」が表示される

  Scenario: ポケモンのIDが表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then 「#025」が表示される

  Scenario: ローディング中にActivityIndicatorが表示される
    Given ローディング中のモック状態が設定されている
    When 詳細画面をID「25」でレンダリングする
    Then ローディングインジケータが表示される

  Scenario: エラー時にエラーメッセージが表示される
    Given エラー状態のモックが設定されている
    When 詳細画面をID「999」でレンダリングする
    Then 「detail.notFound」が表示される

  Scenario: お気に入りボタンが詳細画面に表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then お気に入りボタンが詳細画面に表示される

  Scenario: ステータスが詳細画面に表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then 「detail.baseStats」が表示される

  Scenario: 身長と体重が詳細画面に表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then 「detail.height」が詳細画面に表示される
    And 「detail.weight」が詳細画面に表示される

  Scenario: フレーバーテキストが詳細画面に表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then 「It keeps its tail raised.」が表示される

  Scenario: ローカライズ名がnullの場合はAPI名が表示される
    Given ローカライズ名がnullのモック状態が設定されている
    When 詳細画面をID「25」でレンダリングする
    Then 「Pikachu」が表示される

  # ============================================================
  # PokemonDetailコンポーネント
  # ============================================================

  Scenario: ローカライズ名が渡された場合に表示される
    Given ピカチュウのデータが用意されている
    When ローカライズ名「ピカチュウ」を指定してPokemonDetailをレンダリングする
    Then PokemonDetailに「ピカチュウ」が表示される

  Scenario: ローカライズ名がnullの場合はPokemonDetailでAPI名が表示される
    Given ピカチュウのデータが用意されている
    When ローカライズ名をnullにしてPokemonDetailをレンダリングする
    Then PokemonDetailに「pikachu」が表示される

  Scenario: ポケモンのIDが3桁ゼロ埋めで表示される
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then PokemonDetailに「#025」が表示される

  Scenario: ポケモンの画像が表示される
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then ポケモン画像のURIに「25.png」が含まれる

  Scenario: タイプバッジが翻訳されて表示される
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then PokemonDetailに「types.electric」が表示される

  Scenario: 複数タイプが翻訳されて全て表示される
    Given リザードンのデータが用意されている
    When PokemonDetailをリザードンでレンダリングする
    Then PokemonDetailに「types.fire」が表示される
    And PokemonDetailに「types.flying」も表示される

  Scenario: PokemonDetailにお気に入りボタンが表示される
    Given ピカチュウのデータが用意されている
    When お気に入り機能付きでPokemonDetailをレンダリングする
    Then PokemonDetailのお気に入りボタンが表示される

  Scenario: お気に入りボタン押下後にonToggleFavoriteが呼ばれる
    Given ピカチュウのデータが用意されている
    When お気に入り機能付きでPokemonDetailをレンダリングしてボタンを押す
    Then onToggleFavoriteが1回呼ばれる

  Scenario: お気に入りが未指定の場合ボタンが表示されない
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then PokemonDetailのお気に入りボタンが表示されない

  Scenario: フレーバーテキストが渡された場合にPokemonDetailで表示される
    Given ピカチュウのデータが用意されている
    When フレーバーテキスト付きでPokemonDetailをレンダリングする
    Then PokemonDetailにフレーバーテキストが表示される

  Scenario: フレーバーテキストが未指定の場合は表示されない
    Given ピカチュウのデータが用意されている
    When PokemonDetailをレンダリングする
    Then フレーバーテキストのローディングが表示されない

  # ============================================================
  # PokemonAbilitiesコンポーネント
  # ============================================================

  Scenario: とくせいセクションタイトルが表示される
    Given とくせいリストが与えられている
    When PokemonAbilitiesをレンダリングする
    Then とくせいセクションタイトル「detail.abilities」が表示される

  Scenario: とくせい名がキャピタライズされて表示される
    Given とくせいリストが与えられている
    When PokemonAbilitiesをレンダリングする
    Then とくせい名「Overgrow」が表示される

  Scenario: 隠れとくせいにラベルが付与される
    Given とくせいリストが与えられている
    When PokemonAbilitiesをレンダリングする
    Then 隠れとくせい「Chlorophyll detail.hiddenAbility」が表示される

  Scenario: 複数のとくせいが全て表示される
    Given とくせいリストが与えられている
    When PokemonAbilitiesをレンダリングする
    Then とくせい名「Overgrow」が表示される
    And 隠れとくせい「Chlorophyll detail.hiddenAbility」が表示される

  # ============================================================
  # PokemonFlavorTextコンポーネント
  # ============================================================

  Scenario: フレーバーテキストコンポーネントにテキストが表示される
    Given フレーバーテキストが与えられている
    When PokemonFlavorTextをレンダリングする
    Then テキスト「でんきを　ためこむ　せいしつ。」が表示される

  Scenario: ローディング中にフレーバーテキストのインジケータが表示される
    Given テキストがnullでローディング中である
    When PokemonFlavorTextをレンダリングする
    Then フレーバーテキストのローディングインジケータが表示される

  Scenario: テキストがnullでローディングでない場合は何も表示されない
    Given テキストがnullでローディングでない
    When PokemonFlavorTextをレンダリングする
    Then 何も表示されない

  # ============================================================
  # PokemonPhysicalInfoコンポーネント
  # ============================================================

  Scenario: 身長の値が表示される
    Given 身長7、体重69のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 体格情報「0.7detail.heightUnit」が表示される

  Scenario: 体重の値が表示される
    Given 身長7、体重69のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 体格情報「6.9detail.weightUnit」が表示される

  Scenario: 身長ラベルが表示される
    Given 身長7、体重69のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 体格情報「detail.height」が表示される

  Scenario: 体重ラベルが表示される
    Given 身長7、体重69のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 体格情報「detail.weight」が表示される

  Scenario: 整数の身長が正しくフォーマットされる
    Given 身長20、体重1000のポケモンデータが与えられている
    When PokemonPhysicalInfoをレンダリングする
    Then 体格情報「2.0detail.heightUnit」が表示される
    And 体格情報「100.0detail.weightUnit」も表示される

  # ============================================================
  # PokemonStatsコンポーネント
  # ============================================================

  Scenario: ステータスセクションタイトルが表示される
    Given ステータスデータが与えられている
    When PokemonStatsをレンダリングする
    Then ステータス「detail.baseStats」が表示される

  Scenario: 6つのステータスバーが表示される
    Given ステータスデータが与えられている
    When PokemonStatsをレンダリングする
    Then ステータス「detail.stats.hp」が表示される
    And ステータス「detail.stats.attack」が表示される
    And ステータス「detail.stats.defense」が表示される
    And ステータス「detail.stats.special-attack」が表示される
    And ステータス「detail.stats.special-defense」が表示される
    And ステータス「detail.stats.speed」が表示される

  Scenario: 各ステータスの値が正しく表示される
    Given ステータスデータが与えられている
    When PokemonStatsをレンダリングする
    Then 値「45」が2つ表示される
    And 値「49」が2つ表示される
    And 値「65」が2つ表示される

  # ============================================================
  # StatBarコンポーネント
  # ============================================================

  Scenario: StatBarにステータス名が表示される
    Given ラベル「HP」、値45のStatBarが与えられている
    When StatBarをレンダリングする
    Then StatBarに「HP」が表示される

  Scenario: StatBarにステータス値が表示される
    Given ラベル「HP」、値45のStatBarが与えられている
    When StatBarをレンダリングする
    Then StatBarに「45」が表示される

  Scenario: バーの幅がステータス値に比例する
    Given ラベル「HP」、値128、最大値256のStatBarが与えられている
    When StatBarをレンダリングする
    Then バーの幅が「50%」である

  Scenario: maxValueのデフォルトは180
    Given ラベル「Speed」、値90のStatBarが与えられている
    When StatBarをレンダリングする
    Then バーの幅が「50%」である

  # ============================================================
  # FavoriteButtonコンポーネント（shared）
  # ============================================================

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
