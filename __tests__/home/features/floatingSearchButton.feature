Feature: フローティング検索ボタン

  Scenario: FABボタンが表示される
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
