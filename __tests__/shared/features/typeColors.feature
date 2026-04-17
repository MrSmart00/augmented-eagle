Feature: タイプカラー定義

  Scenario: 全18タイプの色が定義されている
    Given typeColorsが定義されている
    When 全18タイプのキーを確認する
    Then 全てのタイプに色が定義されている
    And キーの数が18である

  Scenario: 各色が有効なHEXカラーコードである
    Given typeColorsが定義されている
    When 全ての色の値を確認する
    Then 全てHEXカラーコード形式である
