import { render, screen } from "../../test-utils/render";
import Layout from "./Layout";

vi.mock("@tanstack/react-router", async (importOriginal: () => Promise<any>) => {
  return {
    ...(await importOriginal()),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe("layout page tests", () => {
  const text = "this is the body inside the layout";
  it("renders as expected", () => {
    render(<Layout children={<p>{text}</p>}></Layout>);

    screen.getByText(text);
  });
});