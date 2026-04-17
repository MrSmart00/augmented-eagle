Feature: ステータスバー表示

  Scenario: ステータス名が表示される
    Given ラベル「HP」、値45のStatBarが与えられている
    When StatBarをレンダリングする
    Then 「HP」が表示される

  Scenario: ステータス値が表示される
    Given ラベル「HP」、値45のStatBarが与えられている
    When StatBarをレンダリングする
    Then 「45」が表示される

  Scenario: バーの幅がステータス値に比例する
    Given ラベル「HP」、値128、最大値256のStatBarが与えられている
    When StatBarをレンダリングする
    Then バーの幅が「50%」である

  Scenario: maxValueのデフォルトは180
    Given ラベル「Speed」、値90のStatBarが与えられている
    When StatBarをレンダリングする
    Then バーの幅が「50%」である
