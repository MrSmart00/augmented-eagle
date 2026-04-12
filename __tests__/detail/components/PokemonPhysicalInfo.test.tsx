import { render, screen } from "@testing-library/react-native";
import { PokemonPhysicalInfo } from "@/src/detail/components/PokemonPhysicalInfo";

describe("PokemonPhysicalInfo", () => {
  it("身長の値が表示される", () => {
    render(<PokemonPhysicalInfo height={7} weight={69} />);
    expect(screen.getByText("0.7detail.heightUnit")).toBeTruthy();
  });

  it("体重の値が表示される", () => {
    render(<PokemonPhysicalInfo height={7} weight={69} />);
    expect(screen.getByText("6.9detail.weightUnit")).toBeTruthy();
  });

  it("身長ラベルが表示される", () => {
    render(<PokemonPhysicalInfo height={7} weight={69} />);
    expect(screen.getByText("detail.height")).toBeTruthy();
  });

  it("体重ラベルが表示される", () => {
    render(<PokemonPhysicalInfo height={7} weight={69} />);
    expect(screen.getByText("detail.weight")).toBeTruthy();
  });

  it("整数の身長が正しくフォーマットされる", () => {
    render(<PokemonPhysicalInfo height={20} weight={1000} />);
    expect(screen.getByText("2.0detail.heightUnit")).toBeTruthy();
    expect(screen.getByText("100.0detail.weightUnit")).toBeTruthy();
  });
});
