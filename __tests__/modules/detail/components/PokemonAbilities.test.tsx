import { render, screen } from "@testing-library/react-native";
import { PokemonAbilities } from "@/src/modules/detail/components/PokemonAbilities";
import type { PokemonAbility } from "@/src/shared";

const mockAbilities: PokemonAbility[] = [
  { name: "overgrow", isHidden: false },
  { name: "chlorophyll", isHidden: true },
];

describe("PokemonAbilities", () => {
  it("セクションタイトルが表示される", () => {
    render(<PokemonAbilities abilities={mockAbilities} />);
    expect(screen.getByText("detail.abilities")).toBeTruthy();
  });

  it("とくせい名がキャピタライズされて表示される", () => {
    render(<PokemonAbilities abilities={mockAbilities} />);
    expect(screen.getByText("Overgrow")).toBeTruthy();
  });

  it("隠れとくせいにラベルが付与される", () => {
    render(<PokemonAbilities abilities={mockAbilities} />);
    expect(screen.getByText("Chlorophyll detail.hiddenAbility")).toBeTruthy();
  });

  it("複数のとくせいが全て表示される", () => {
    render(<PokemonAbilities abilities={mockAbilities} />);
    expect(screen.getByText("Overgrow")).toBeTruthy();
    expect(screen.getByText("Chlorophyll detail.hiddenAbility")).toBeTruthy();
  });
});
