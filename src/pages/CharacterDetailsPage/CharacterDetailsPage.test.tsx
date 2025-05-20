import { act, render, screen, waitFor, within } from "@/test-utils/render";
import CharacterDetailsPage from "./CharacterDetailsPage";
import mockedUserData from "../../../mocks/mock-data/user.json";
import film from "../../../mocks/mock-data/film.json";
import starship from "../../../mocks/mock-data/starship.json";
import mockPlanetResponse from "../../../mocks/mock-data/mockPlanetResponse";
import { server } from "../../../mocks/server";
import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";
const charactersPageContent = "This is characters page";
const routes = [
  {
    path: "/character-details/$id",
    component: CharacterDetailsPage,
  },
  {
    path: "/characters",
    component: () => <div>{charactersPageContent}</div>,
  },
];
describe("CharacterDetailsPage", () => {
  beforeEach(() => {
    server.use(
      http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/people/:id", (req) => {
        // const { id } = req.params;
        console.log("sending empty movies");
        // Mock response for the character details endpoint
        return HttpResponse.json({
          ...mockedUserData,
        });
      })
    );
  });

  afterEach(async () => {
    server.resetHandlers();
  });
  test("renders as expected", async () => {
    const { router } = render(<CharacterDetailsPage />, { routes });
    await act(() => {
      router.navigate({
        to: "/character-details/1",
      });
    });
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: /luke skywalker/i, level: 1 })
    ).toBeInTheDocument();
    const profileSection = screen.getByRole("region", {
      name: /character profile/i,
    });
    expect(profileSection).toBeInTheDocument();
    expect(
      within(profileSection).getByAltText(/luke skywalker/i)
    ).toBeInTheDocument();
    expect(
      within(profileSection).getByRole("button", { name: /add to favourites/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("region", { name: /character details/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /featured movies/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /starships piloted/i })
    ).toBeInTheDocument();
  });

  test("loads and displays character details", async () => {
    const { router } = render(<CharacterDetailsPage />, { routes });
    const characterId = 1;
    await act(() => {
      router.navigate({
        to: "/character-details/" + characterId,
      });
    });
    const user = mockedUserData.result.properties;
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
    const detailsSection = screen.getByRole("region", {
      name: /character details/i,
    });
    expect(detailsSection).toBeInTheDocument();

    const hairColorDetails = within(detailsSection).getByTestId("hair-colour");
    expect(
      within(hairColorDetails).getByText("Hair Colour")
    ).toBeInTheDocument();
    expect(
      within(hairColorDetails).getByText(new RegExp(user.hair_color, "i"))
    ).toBeInTheDocument();

    const eyeColorDetails = within(detailsSection).getByTestId("eye-colour");
    expect(within(eyeColorDetails).getByText("Eye Colour")).toBeInTheDocument();
    expect(
      within(eyeColorDetails).getByText(new RegExp(user.eye_color, "i"))
    ).toBeInTheDocument();

    const genderDetails = within(detailsSection).getByTestId("gender");
    expect(within(genderDetails).getByText("Gender")).toBeInTheDocument();
    expect(
      within(genderDetails).getByText(new RegExp(user.gender, "i"))
    ).toBeInTheDocument();

    const homePlanetDetails = within(detailsSection).getByTestId("home-world");
    expect(
      within(homePlanetDetails).getByText("Home World")
    ).toBeInTheDocument();

    //the implementation first renders sections, without dtails like homoworld name, etc. these details will load with separate apis
    await waitFor(() => {
      const planetDetails = mockPlanetResponse({ id: characterId });
      expect(
        within(homePlanetDetails).getByText(
          planetDetails.result.properties.name
        )
      ).toBeInTheDocument();
    });

    const heightDetails = within(detailsSection).getByTestId("height");
    expect(within(heightDetails).getByText("Height")).toBeInTheDocument();
    expect(
      within(heightDetails).getByText(user.height + " cm")
    ).toBeInTheDocument();

    const birthYear = within(detailsSection).getByTestId("birth-year");
    expect(within(birthYear).getByText("Birth Year")).toBeInTheDocument();
    expect(within(birthYear).getByText(user.birth_year)).toBeInTheDocument();
  });

  test("loads and displays movies list", async () => {
    const { router } = render(<CharacterDetailsPage />, { routes });
    await act(() => {
      router.navigate({
        to: "/character-details/1",
      });
    });

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
    const movies = mockedUserData.result.properties.films.map(
      (m) => film.result.properties.title
    );

    let moviesSection: HTMLElement;
    await waitFor(() => {
      moviesSection = screen.getByRole("region", {
        name: /featured movies/i,
      });
      expect(moviesSection).toBeInTheDocument();
    });
    let moviesListItems: HTMLElement[];
    await waitFor(() => {
      moviesSection = screen.getByRole("region", {
        name: /featured movies/i,
      });
      expect(moviesSection).toBeInTheDocument();
      moviesListItems = within(moviesSection!).getAllByRole("listitem");
      expect(moviesListItems.length).toBe(movies.length);
    });
    movies.forEach((movie, idx) => {
      expect(
        within(moviesListItems[idx]).getByText(new RegExp(movie, "i"))
      ).toBeInTheDocument();
    });
  });

  test("shows empty msg up on no movies", async () => {
    //todo: does not override the default handler, when run in group
    server.use(
      http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/people/:id", (req) => {
        // const { id } = req.params;
        console.log("sending empty movies");
        // Mock response for the character details endpoint
        return HttpResponse.json({
          ...mockedUserData,
          result: {
            ...mockedUserData.result,
            properties: {
              ...mockedUserData.result.properties,
              films: [],
            },
          },
        });
      })
    );
    const { router } = render(<CharacterDetailsPage />, { routes });
    await act(() => {
      router.navigate({
        to: "/character-details/1",
      });
    });

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const moviesSection = screen.getByRole("region", {
      name: /featured movies/i,
    });

    const noMoviesMessage =
      within(moviesSection).getByText(/no featured movies/i);
    expect(noMoviesMessage).toBeInTheDocument();
  });

  test("loads and displays starships list", async () => {
    const { router } = render(<CharacterDetailsPage />, { routes });
    await act(() => {
      router.navigate({
        to: "/character-details/1",
      });
    });
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const starShipsSection = screen.getByRole("region", {
      name: /starships piloted/i,
    });
    expect(starShipsSection).toBeInTheDocument();
    const starShips = mockedUserData.result.properties.starships.map(
      (s) => starship.result.properties.name
    );
    await waitFor(() => {
      const starShipTags = within(starShipsSection).getAllByRole("listitem");

      expect(starShipTags.length).toBe(starShips.length);

      starShips.forEach((shipName, idx) => {
        expect(
          within(starShipTags[idx]).getByText(new RegExp(shipName, "i"))
        ).toBeInTheDocument();
      });
    });
  });

  test("shows empty message when no starships", async () => {
    //todo: does not override the default handler
    server.use(
      http.get(import.meta.env.VITE_SWAPI_BASE_URL + "/people/:id", (req) => {
        console.log("sending empty starships");
        const { id } = req.params;
        // Mock response for the character details endpoint
        return HttpResponse.json({
          ...mockedUserData,
          result: {
            ...mockedUserData.result,
            properties: {
              ...mockedUserData.result.properties,
              starships: [],
            },
          },
        });
      })
    );
    const { router } = render(<CharacterDetailsPage />, { routes });
    await act(() => {
      router.navigate({
        to: "/character-details/1",
      });
    });
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const starShipsSection = screen.getByRole("region", {
      name: /starships piloted/i,
    });
    const noStarshipsMessage =
      within(starShipsSection).getByText(/no starships piloted/i);
    expect(noStarshipsMessage).toBeInTheDocument();
  });

  test("Favourite and unFavourite actions work as expected", async () => {
    const { router } = render(<CharacterDetailsPage />, { routes });
    await act(() => {
      router.navigate({
        to: "/character-details/1",
      });
    });
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
    const favouriteButton = screen.getByRole("button", {
      name: /add to favourites/i,
    });
    expect(favouriteButton).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /my favourite/i })
    ).not.toBeInTheDocument();

    await userEvent.click(favouriteButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /add to favourites/i })
      ).not.toBeInTheDocument();
    });
    const removeFavouriteButton = screen.getByRole("button", {
      name: /my favourite/i,
    });

    await userEvent.click(removeFavouriteButton);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /my favourite/i })
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: /add to favourites/i })
    ).toBeInTheDocument();
  });

  test("shows error message when main character api fails", async () => {
    server.use(
      http.get(
        import.meta.env.VITE_SWAPI_BASE_URL + "/people/:id",
        (req: any) => {
          return HttpResponse.error();
        }
      )
    );

    await errorAssertions();
  });

  test("shows error message when planet api fails", async () => {
    server.use(
      http.get(
        import.meta.env.VITE_SWAPI_BASE_URL + "/planets/:id",
        (req: any) => {
          return HttpResponse.error();
        }
      )
    );
    // const { router } = render(<CharacterDetailsPage />, { routes });
    // await act(() => {
    //   router.navigate({
    //     to: "/character-details/1",
    //   });
    // });
    // let detailsSection:HTMLElement
    // await waitFor(() => {
    //   expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    //   expect(detailsSection = screen.getByRole('region', {name: /character details/i})).toBeInTheDocument()
    // });
    // const homePlanetDetails = within(detailsSection).getByTestId("home-world");
    // expect(
    //   within(homePlanetDetails).getByText("Home World")
    // ).toBeInTheDocument();

    // //the implementation first renders sections, without dtails like homoworld name, etc. these details will load with separate apis
    // await waitFor(() => {
    //   const planetDetails = mockPlanetResponse({ id: characterId });
    //   expect(
    //     within(homePlanetDetails).getByText(
    //       planetDetails.result.properties.name
    //     )
    //   ).toBeInTheDocument();
    // });
    await errorAssertions();
  });

  test("shows error message when films api fails", async () => {
    server.use(
      http.get(
        import.meta.env.VITE_SWAPI_BASE_URL + "/films/:id",
        (req: any) => {
          return HttpResponse.error();
        }
      )
    );

    await errorAssertions();
  });
  test("shows error message when starship api fails", async () => {
    server.use(
      http.get(
        import.meta.env.VITE_SWAPI_BASE_URL + "/starships/:id",
        (req: any) => {
          return HttpResponse.error();
        }
      )
    );

    await errorAssertions();
  });
});

async function errorAssertions() {
  const { router } = render(<CharacterDetailsPage />, { routes });
  await act(() => {
    router.navigate({
      to: "/character-details/1",
    });
  });
  await waitFor(() => {
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(
      screen.getByText("Error loading character details")
    ).toBeInTheDocument();
  });
  const goBack = screen.getByRole("button", { name: /go back/i });
  expect(goBack).toBeInTheDocument();

  await userEvent.click(goBack);

  await waitFor(() => {
    expect(screen.getByText(charactersPageContent)).toBeInTheDocument();
    expect(router.latestLocation.pathname.includes("/characters")).toBe(true);
  });
}
