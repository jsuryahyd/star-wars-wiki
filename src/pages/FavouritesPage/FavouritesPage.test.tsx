import { render, screen, fireEvent, waitFor, within } from "@/test-utils/render";
import FavouritesPage from "./FavouritesPage";
import favourites from "../../../mocks/mock-data/favourites.json";
import { server } from "../../../mocks/server";
import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";

// Mock the "mocks/db" module with in-memory favourites array

vi.mock("../../../mocks/db", () => {
	const mockFavourites = [...favourites];
	return {
		getDB: vi.fn(),
		getFavourites: vi.fn(async () => [...mockFavourites]),
		addFavourite: vi.fn(async (fav) => {
			mockFavourites.push(fav);
			return fav;
		}),
		removeFavourite: vi.fn(async (id) => {
			const idx = mockFavourites.findIndex(f => f.id === id);
			if (idx !== -1) mockFavourites.splice(idx, 1);
			return id;
		}),
	};
});

describe("FavouritesPage", () => {
  afterEach(() => {
    server.resetHandlers();
  });

  test("renders as expected",async  () => {
    render(<FavouritesPage />);
     await waitFor(()=>{
			expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
		})

		const favouritesGrid = screen.getByRole("region", {name: "favourites list"});
		expect(favouritesGrid).toBeInTheDocument();

		const favouriteCards = screen.getAllByRole("article");
		expect(favouriteCards.length).toBe(favourites.length);
		favourites.forEach((favourite, idx) => {
			expect(favouriteCards[idx]).toContainElement(
				screen.getByText(new RegExp(favourite.name, "i"))
			);
		});
  });

  test("shows error message and retry button on error", async () => {
    // Simulate error state using MSW
		server.use(
			http.get("/api/favourites", () => {
			return HttpResponse.json({ message: "Internal Server Error" }, { status: 500 });
			})
		)
    render(<FavouritesPage />);
    expect(
      await screen.findByText(/Error loading characters/i)
    ).toBeInTheDocument();
    const retryBtn = screen.getByRole("button", { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    // Optionally, assert refetch or loading state
  });

  test("shows 'No Favourites Yet' when list is empty", async () => {
     // Simulate error state using MSW
		server.use(
			http.get("/api/favourites", () => {
			return HttpResponse.json([], { status: 200 });
			})
		)
    render(<FavouritesPage />);
    expect(await screen.findByText(/No Favourites Yet/i)).toBeInTheDocument();
  });



  it.only("calls removeFavourite when remove button is clicked", async () => {
    // Simulate favourite characters using MSW
    render(<FavouritesPage />);
		await waitFor(()=>{
			expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
		})
    const articles = screen.getAllByRole("article");
		expect(articles.length).toBe(favourites.length);
    const removeButton = within(articles[0]).getByRole("button", {
			name: /remove/i,
		});
    expect(removeButton).toBeInTheDocument();
		await userEvent.click(removeButton);

		// Optionally, assert that the character is removed from the list
		await waitFor(() => {
			expect(screen.queryByText(/luke skywalker/i)).not.toBeInTheDocument();
			expect(screen.getAllByRole("article").length).toBe(favourites.length - 1);
		});
  });
});
