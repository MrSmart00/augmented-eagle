import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react-native";
import { StatBar } from "@/src/detail/components/StatBar";

const feature = loadFeature(
  "__tests__/detail/features/statBar.feature"
);

defineFeature(feature, (test) => {
  let label: string;
  let value: number;
  let maxValue: number | undefined;

  test("ステータス名が表示される", ({ given, when, then }) => {
    given(/^ラベル「(.*)」、値(\d+)のStatBarが与えられている$/, (l: string, v: string) => {
      label = l;
      value = Number(v);
      maxValue = undefined;
    });

    when("StatBarをレンダリングする", () => {
      render(<StatBar label={label} value={value} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ステータス値が表示される", ({ given, when, then }) => {
    given(/^ラベル「(.*)」、値(\d+)のStatBarが与えられている$/, (l: string, v: string) => {
      label = l;
      value = Number(v);
      maxValue = undefined;
    });

    when("StatBarをレンダリングする", () => {
      render(<StatBar label={label} value={value} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("バーの幅がステータス値に比例する", ({ given, when, then }) => {
    given(/^ラベル「(.*)」、値(\d+)、最大値(\d+)のStatBarが与えられている$/, (l: string, v: string, m: string) => {
      label = l;
      value = Number(v);
      maxValue = Number(m);
    });

    when("StatBarをレンダリングする", () => {
      render(<StatBar label={label} value={value} maxValue={maxValue} />);
    });

    then(/^バーの幅が「(.*)」である$/, (width: string) => {
      const bar = screen.getByTestId("stat-bar-fill");
      expect(bar.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width }),
        ])
      );
    });
  });

  test("maxValueのデフォルトは180", ({ given, when, then }) => {
    given(/^ラベル「(.*)」、値(\d+)のStatBarが与えられている$/, (l: string, v: string) => {
      label = l;
      value = Number(v);
      maxValue = undefined;
    });

    when("StatBarをレンダリングする", () => {
      render(<StatBar label={label} value={value} />);
    });

    then(/^バーの幅が「(.*)」である$/, (width: string) => {
      const bar = screen.getByTestId("stat-bar-fill");
      expect(bar.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width }),
        ])
      );
    });
  });
});
