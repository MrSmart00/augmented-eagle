import { render, screen } from "@testing-library/react-native";
import { PokemonPhysicalInfo } from "@/src/modules/detail/components/PokemonPhysicalInfo";

describe("PokemonPhysicalInfo", () => {
  it("身長がメートル単位で表示される", () => {
    render(<PokemonPhysicalInfo height={7} weight={69} />);
    expect(screen.getByText("0.7 m")).toBeTruthy();
  });

  it("体重がキログラム単位で表示される", () => {
    render(<PokemonPhysicalInfo height={7} weight={69} />);
    expect(screen.getByText("6.9 kg")).toBeTruthy();
  });

  it("身長ラベルが表示される", () => {
    render(<PokemonPhysicalInfo height={7} weight={69} />);
    expect(screen.getByText("Height")).toBeTruthy();
  });

  it("体重ラベルが表示される", () => {
    render(<PokemonPhysicalInfo height={7} weight={69} />);
    expect(screen.getByText("Weight")).toBeTruthy();
  });

  it("整数の身長が正しくフォーマットされる", () => {
    render(<PokemonPhysicalInfo height={20} weight={1000} />);
    expect(screen.getByText("2.0 m")).toBeTruthy();
    expect(screen.getByText("100.0 kg")).toBeTruthy();
  });
});
