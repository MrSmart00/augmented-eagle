Feature: useFloatingSearchフック

  Scenario: 初期状態でisExpandedがfalse
    Given useFloatingSearchフックがレンダリングされている
    Then isExpandedはfalseである

  Scenario: toggle()で展開状態が切り替わる
    Given useFloatingSearchフックがレンダリングされている
    When toggleを実行する
    Then isExpandedはtrueである
    When toggleを再度実行する
    Then isExpandedはfalseである

  Scenario: close()で常に折りたたまれる
    Given useFloatingSearchフックがレンダリングされている
    When toggleを実行する
    And closeを実行する
    Then isExpandedはfalseである

  Scenario: close()は折りたたみ状態でも安全に呼べる
    Given useFloatingSearchフックがレンダリングされている
    When closeを実行する
    Then isExpandedはfalseである

  Scenario: アニメーションスタイルを返す
    Given useFloatingSearchフックがレンダリングされている
    Then fabAnimatedStyleが定義されている
    And iconAnimatedStyleが定義されている
    And inputAnimatedStyleが定義されている
