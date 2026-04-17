import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { FavoriteButton } from "@/src/shared";

const feature = loadFeature(
  "__tests__/shared/features/favoriteButton.feature"
);

defineFeature(feature, (test) => {
  let onToggle: jest.Mock;
  let rerender: ReturnType<typeof render>["rerender"];

  test("Lottieアニメーションコンポーネントが描画される", ({
    given,
    then,
  }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      onToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    });

    then("Lottieアニメーションコンポーネントが存在する", () => {
      expect(screen.getByTestId("favorite-lottie")).toBeTruthy();
    });
  });

  test("autoPlayが無効になっている", ({ given, then }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      onToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    });

    then("autoPlayがfalseである", () => {
      const lottie = screen.getByTestId("favorite-lottie");
      expect(lottie.props.autoPlay).toBe(false);
    });
  });

  test("ループが無効になっている", ({ given, then }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      onToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    });

    then("loopがfalseである", () => {
      const lottie = screen.getByTestId("favorite-lottie");
      expect(lottie.props.loop).toBe(false);
    });
  });

  test("ボタン押下時にonToggleが即座に呼ばれる", ({ given, when, then }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      onToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    });

    when("お気に入りボタンを押す", () => {
      fireEvent.press(screen.getByTestId("favorite-button"));
    });

    then("onToggleが1回呼ばれる", () => {
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  test("お気に入り状態の場合、ONの最終フレームで初期表示される", ({
    given,
    then,
  }) => {
    given("お気に入り状態のFavoriteButtonを描画する", () => {
      onToggle = jest.fn();
      render(<FavoriteButton isFavorite={true} onToggle={onToggle} />);
    });

    then("progressがON最終フレームの値である", () => {
      const lottie = screen.getByTestId("favorite-lottie");
      expect(lottie.props.progress).toBeCloseTo(90 / 181);
    });
  });

  test("非お気に入り状態の場合、progressが0で初期表示される", ({
    given,
    then,
  }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      onToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    });

    then("progressが0である", () => {
      const lottie = screen.getByTestId("favorite-lottie");
      expect(lottie.props.progress).toBe(0);
    });
  });

  test("外部からisFavoriteが変更された場合、progressが再同期される", ({
    given,
    then,
    when,
  }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      onToggle = jest.fn();
      const result = render(
        <FavoriteButton isFavorite={false} onToggle={onToggle} />
      );
      rerender = result.rerender;
    });

    then("progressが0である", () => {
      expect(screen.getByTestId("favorite-lottie").props.progress).toBe(0);
    });

    when("isFavoriteをtrueに変更する", () => {
      rerender(<FavoriteButton isFavorite={true} onToggle={onToggle} />);
    });

    then("progressがON最終フレームの値である", () => {
      expect(
        screen.getByTestId("favorite-lottie").props.progress
      ).toBeCloseTo(90 / 181);
    });
  });

  test("お気に入り状態のアクセシビリティラベルが正しい", ({
    given,
    then,
  }) => {
    given("お気に入り状態のFavoriteButtonを描画する", () => {
      onToggle = jest.fn();
      render(<FavoriteButton isFavorite={true} onToggle={onToggle} />);
    });

    then(
      /^アクセシビリティラベルが "(.*)" である$/,
      (label: string) => {
        expect(screen.getByLabelText(label)).toBeTruthy();
      }
    );
  });

  test("非お気に入り状態のアクセシビリティラベルが正しい", ({
    given,
    then,
  }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      onToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    });

    then(
      /^アクセシビリティラベルが "(.*)" である$/,
      (label: string) => {
        expect(screen.getByLabelText(label)).toBeTruthy();
      }
    );
  });
});
