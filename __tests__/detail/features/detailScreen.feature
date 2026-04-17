Feature: 詳細画面

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

  Scenario: お気に入りボタンが表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then お気に入りボタンが表示される

  Scenario: ステータスが詳細画面に表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then 「detail.baseStats」が表示される

  Scenario: 身長と体重が詳細画面に表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then 「detail.height」が表示される
    And 「detail.weight」が表示される

  Scenario: フレーバーテキストが表示される
    Given ピカチュウの詳細データとローカライズ名がモックされている
    When 詳細画面をID「25」でレンダリングする
    Then 「It keeps its tail raised.」が表示される

  Scenario: ローカライズ名がnullの場合はAPI名が表示される
    Given ローカライズ名がnullのモック状態が設定されている
    When 詳細画面をID「25」でレンダリングする
    Then 「Pikachu」が表示される
