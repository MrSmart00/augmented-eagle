import { render, screen } from "@testing-library/react-native";
import { HomeScreen } from "@/src/modules/home";

jest.mock("expo-router", () => ({
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
    asChild?: boolean;
  }) => {
    const { View } = require("react-native");
    return <View testID={`link-${href}`}>{children}</View>;
  },
}));

describe("HomeScreen", () => {
  it("ポケモンカードが表示される", () => {
    render(<HomeScreen />);
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
    expect(screen.getByText("フシギダネ")).toBeTruthy();
  });

  it("各カードが詳細画面へのリンクを持つ", () => {
    render(<HomeScreen />);
    expect(screen.getByTestId("link-/detail/25")).toBeTruthy();
    expect(screen.getByTestId("link-/detail/1")).toBeTruthy();
  });
});
