Feature: スプラッシュアニメーションフック

  Scenario: マウント時にSplashScreen.hideAsyncが呼ばれる
    Given onFinishコールバックが用意されている
    When フックをレンダーする
    Then SplashScreen.hideAsyncが1回呼ばれる

  Scenario: delay前にはonFinishが呼ばれない
    Given onFinishコールバックとdelay 800ms が用意されている
    When フックをレンダーして500ms経過する
    Then onFinishは呼ばれていない

  Scenario: delay後にonFinishコールバックが呼ばれる
    Given onFinishコールバックとdelay 800ms が用意されている
    When フックをレンダーして800ms経過する
    Then onFinishが1回呼ばれる

  Scenario: アンマウント時にタイマーがクリーンアップされる
    Given onFinishコールバックとdelay 800ms が用意されている
    When フックをレンダーしてアンマウントし1000ms経過する
    Then onFinishは呼ばれていない

  Scenario: animatedStyleオブジェクトを返す
    Given onFinishコールバックが用意されている
    When フックをレンダーする
    Then animatedStyleにopacityプロパティがある
    And animatedStyleにtransformプロパティがある
