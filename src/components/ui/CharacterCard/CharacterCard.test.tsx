import { render, screen, waitFor } from "@/test-utils/render";
import { CharacterCard } from "./CharacterCard";
import userEvent from "@testing-library/user-event";

vi.mock(
  "@tanstack/react-router",
  async (importOriginal: () => Promise<any>) => {
    return {
      ...(await importOriginal()),
      Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
        <a href={to}>{children}</a>
      ),
    };
  }
);
describe("CharacterCard", () => {
  it("renders correctly", () => {
    render(
      <CharacterCard
        name="Jaya Surya"
        details={[
          { label: "gender", value: "Male" },
          { label: "homePlanet", value: "Earth" },
        ]}
        id="1"
      />
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Jaya Surya"
    );
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("Earth")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    render(
      <CharacterCard
        name="Jaya Surya"
        details={[
          { label: "gender", value: "Male" },
          { label: "homePlanet", value: "Earth" },
        ]}
        id="1"
      />
    );
    expect(screen.getByRole("article")).toMatchSnapshot();
  });

  it("renders the top right element", async () => {
    const onClick = vi.fn();
    render(
      <CharacterCard
        name="Jaya Surya"
        details={[]}
        id="1"
        renderTopRight={(id) => {
          return <span onClick={onClick}>Id is {id}</span>;
        }}
      />
    );

    expect(screen.getByText(/Id is 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/click success/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByText(/Id is 1/i));
    await waitFor(
      () => {
        expect(onClick).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });
});
