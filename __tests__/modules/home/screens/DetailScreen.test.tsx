import { render, screen } from "@testing-library/react-native";
import { DetailScreen } from "@/src/modules/home";

describe("DetailScreen", () => {
  it("指定IDのポケモン詳細が表示される", () => {
    render(<DetailScreen id="25" />);
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
  });

  it("ポケモンのIDが表示される", () => {
    render(<DetailScreen id="25" />);
    expect(screen.getByText("#025")).toBeTruthy();
  });

  it("存在しないIDの場合エラーメッセージが表示される", () => {
    render(<DetailScreen id="999" />);
    expect(screen.getByText("ポケモンが見つかりません")).toBeTruthy();
  });
});
