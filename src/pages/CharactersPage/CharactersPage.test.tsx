import { render, screen, waitFor, act, within } from "@/test-utils/render";
import CharactersPage from "./CharactersPage";
import { characters } from "../../../mocks/handlers";
import mockUserData from "../../../mocks/mock-data/user.json";
import userEvent from "@testing-library/user-event";
import { server } from "../../../mocks/server";
import { http, HttpResponse } from "msw";
import mockPlanetResponse from "../../../mocks/mock-data/mockPlanetResponse";
vi.mock("@chakra-ui/react", async (importOriginal: () => Promise<any>) => {
  const original = await importOriginal();
  return {
    ...original,
    Avatar: {
      //generates different ids everytime
      ...original.Avatar,
      Root: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      Fallback: () => <div>Fallback</div>,
      Image: () => <div>Image</div>,
    },
  };
});
describe("CharactersPage", () => {
  const routes = [
    {
      path: "/characters/:id",
      component: () => {
        console.log({ location });
        const id = location.pathname.split("/")?.[2];
        return <div>Character Details {id}</div>;
      },
    },
  ];

  afterEach(() => {
    server.resetHandlers();
  });

  test("renders correctly", async () => {
    const { router } = render(<CharactersPage />, { routes });
    await act(() =>
      router.navigate({
        to: "/",
      })
    );

    expect(screen.getByRole("searchbox")).toBeInTheDocument();

    expect(screen.queryByRole("progressbar")).toBeInTheDocument();
  });

  test("loads and displays characters", async () => {
    const { router } = render(<CharactersPage />, { routes });
    await act(() =>
      router.navigate({
        to: "/",
      })
    );
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 4000 }
    );

    const charactersGrid = screen.getByRole("region", {
      name: "characters list",
    });
    expect(charactersGrid).toBeInTheDocument();
    const articles = within(charactersGrid).getAllByRole("article");
    expect(articles.length).toBe(characters.length);
    characters.forEach((character, idx) => {
      expect(articles[idx]).toContainElement(
        within(charactersGrid).getByText(new RegExp(character.name, "i"))
      );
      //gender and homeworld are already tested in CharacterCard test
      // the data is not available in the mock, can add it to the mock and test
    });
    // expect(charactersGrid).toMatchSnapshot();
  });

  test("shows retry button on error", async () => {
    server.use(
      http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/people*", (req: any) => {
        return HttpResponse.error();
      })
    );
    const { router } = render(<CharactersPage />, { routes });
    await act(() =>
      router.navigate({
        to: "/",
      })
    );
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 6000 }
    );
    expect(screen.getByText("Error loading characters")).toBeInTheDocument();
    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    server.resetHandlers()
    await userEvent.click(retryButton);
    // expect(await screen.findByRole("progressbar")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByText("Error loading characters")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /retry/i })
      ).not.toBeInTheDocument();
    });
  });

  test("search works as expected", async () => {
    const { router } = render(<CharactersPage />, { routes });
    await act(() =>
      router.navigate({
        to: "/",
      })
    );
    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toBeInTheDocument();
    let charactersGrid: HTMLElement;
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        charactersGrid = screen.getByRole("region", {
          name: "characters list",
        });
      },
      { timeout: 4000 }
    );
    await userEvent.type(searchInput, "Luke");
    expect(searchInput).toHaveValue("Luke");
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        const articles = within(
          screen.getByRole("region", {
            name: "characters list",
          })
        ).getAllByRole("article"); //important: do not use charactersGrid here, it will be stale
        // console.log(router.latestLocation, "location");//works fine

        // console.log(articles.length, "num articles");
        expect(articles.length).toBe(1);
      },
      { timeout: 2000 }
    );
    // await waitFor(() => {

    // })
    screen
      .getAllByText(/luke/i)
      .forEach((el) => expect(el).toBeInTheDocument());
    expect(screen.queryByText(/Leia/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Darth Vader/i)).not.toBeInTheDocument();
  }, 10000);

  test("cards reset when search is cleared", async () => {
    const { router } = render(<CharactersPage />, { routes });
    await act(() =>
      router.navigate({
        to: "/",
        search: { name: "Luke" },
      })
    );
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 4000 }
    );
    const searchInput = screen.getByRole("searchbox");
    await waitFor(() => {
      expect(searchInput).toHaveValue("Luke");
    });
    await userEvent.clear(searchInput);
    expect(searchInput).toHaveValue("");
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        const charactersGrid = screen.getByRole("region", {
          name: "characters list",
        });
        expect(charactersGrid).toBeInTheDocument();
        const articles = within(charactersGrid).getAllByRole("article");
        expect(articles.length).toBe(characters.length);
        characters.forEach((character, idx) => {
          expect(articles[idx]).toContainElement(
            within(charactersGrid).getByText(new RegExp(character.name, "i"))
          );
          //gender and homeworld are already tested in CharacterCard test
          // the data is not available in the mock, can add it to the mock and test
        });
        // expect(charactersGrid).toMatchSnapshot();
      },
      { timeout: 4000 }
    );
  }, 10000);

  test("cards reset when search is cleared via refresh button", async () => {
    const { router } = render(<CharactersPage />, { routes });
    await act(() =>
      router.navigate({
        to: "/",
        search: { name: "Luke" },
      })
    );
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 4000 }
    );
    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toHaveValue("Luke");
    await waitFor(() => {
      expect(screen.getAllByRole("article").length).toBe(1);
    });
    await userEvent.click(
      screen.getByRole("button", { name: /Refresh character list/i })
    );
    expect(searchInput).toHaveValue("");
    let charactersGrid: HTMLElement;
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        charactersGrid = screen.getByRole("region", {
          name: "characters list",
        });
      },
      { timeout: 4000 }
    );
    expect(charactersGrid).toBeInTheDocument();
    const articles = within(charactersGrid).getAllByRole("article");
    expect(articles.length).toBe(characters.length);
    // expect(charactersGrid).toMatchSnapshot();
  });

  test("Pagination works", async () => {
    const { router } = render(<CharactersPage />, { routes });
    await act(() =>
      router.navigate({
        to: "/",
      })
    );
    let pagination: HTMLElement;
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        pagination = screen.getByRole("navigation");
        expect(pagination).toBeInTheDocument();
        expect(pagination).toHaveAccessibleName("pagination");
      },
      { timeout: 4000 }
    );
    pagination = screen.getByRole("navigation", {
      name: "pagination",
    });
    let nextButton = within(pagination).getByRole("button", {
      name: /next page/i,
    });
    expect(nextButton).toBeInTheDocument();
    let prevButton = within(pagination).getByRole("button", {
      name: /previous page/i,
    });
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    await userEvent.click(nextButton);

    //todo: whole pagination component is replaced, as for some reason, totalPageCount is becoming 0 intermittently.
    pagination = await screen.findByRole("navigation", {
      name: "pagination",
    });
    nextButton = within(pagination).getByRole("button", {
      name: /next page/i,
    });
    expect(nextButton).toBeInTheDocument();
    prevButton = within(pagination).getByRole("button", {
      name: /previous page/i,
    });
    await waitFor(() => {
      expect(prevButton).not.toBeDisabled();
      // expect(nextButton).toBeDisabled();//todo: test this by clicking on last button
      expect(router.latestLocation.search["page"]).toBe(2);
      const page2Button = within(pagination).getByRole("button", {
        name: /2/i,
      });
      expect(page2Button).toBeInTheDocument();
      expect(page2Button).toHaveAttribute("aria-current", "page");
    });
    let articles: HTMLElement[];
    await waitFor(() => {
      const charactersGrid = screen.getByRole("region", {
        name: "characters list",
      });
      expect(charactersGrid).toBeInTheDocument();
      articles = within(charactersGrid).getAllByRole("article");

      expect(articles.length).toBe(characters.length);
      characters.forEach((character, idx) => {
        expect(articles[idx]).toContainElement(
          within(charactersGrid).getByText(
            new RegExp(character.name + " 2", "i")
          )
        );
      });
      // expect(charactersGrid).toMatchSnapshot();
    });
  }, 10000);
});
