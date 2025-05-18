import { render, screen, waitFor, within } from "@/test-utils/render";
import { CharacterCard } from "./CharacterCard";
import userEvent from "@testing-library/user-event";
import {Avatar} from "@chakra-ui/react" 
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
vi.mock("@chakra-ui/react", async (importOriginal: () => Promise<any>) => { 
  const original = await importOriginal();
  return {
    ...original,
    Avatar: { //generates different ids everytime
      ...original.Avatar,
      Root: ({ children, ...props }: any) => (
        <div {...props}>{children}</div>
      ),
      Fallback: () => <div>Fallback</div>,
      Image: () => <div>Image</div>,
    },
  };
});

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
    testCharacterCard(screen, {
      name: "Jaya Surya",
      gender: "Male",
      homeWorld: "Earth",
    });
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


export function testCharacterCard(screen:any = screen, character?: any) {
  const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
    expect(within(article).getByRole("heading", { level: 3 })).toHaveTextContent(
      new RegExp(character?.name, "i")
    );
    expect(within(article).getByText(new RegExp(character.gender, "i"))).toBeInTheDocument();
    expect(within(article).getByText(character.homeWorld)).toBeInTheDocument();
}