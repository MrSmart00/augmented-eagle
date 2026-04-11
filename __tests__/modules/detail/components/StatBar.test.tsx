import { render, screen } from "@testing-library/react-native";
import { StatBar } from "@/src/modules/detail/components/StatBar";

describe("StatBar", () => {
  it("ステータス名が表示される", () => {
    render(<StatBar label="HP" value={45} />);
    expect(screen.getByText("HP")).toBeTruthy();
  });

  it("ステータス値が表示される", () => {
    render(<StatBar label="HP" value={45} />);
    expect(screen.getByText("45")).toBeTruthy();
  });

  it("バーの幅がステータス値に比例する", () => {
    render(<StatBar label="HP" value={128} maxValue={256} />);
    const bar = screen.getByTestId("stat-bar-fill");
    expect(bar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: "50%" }),
      ])
    );
  });

  it("maxValueのデフォルトは180", () => {
    render(<StatBar label="Speed" value={90} />);
    const bar = screen.getByTestId("stat-bar-fill");
    expect(bar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: "50%" }),
      ])
    );
  });
});
