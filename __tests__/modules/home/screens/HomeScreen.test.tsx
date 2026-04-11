import { render, screen } from "@testing-library/react-native";
import { HomeScreen } from "@/src/modules/home";

describe("HomeScreen", () => {
  it("ポケモンカードが表示される", () => {
    render(<HomeScreen />);
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
    expect(screen.getByText("フシギダネ")).toBeTruthy();
  });
});
