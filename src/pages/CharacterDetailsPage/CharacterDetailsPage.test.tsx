import { act, render, screen, within } from "@/test-utils/render";
import CharacterDetailsPage from "./CharacterDetailsPage"

describe("CharacterDetailsPage", () => {
	const routes = [{
		path: "/character-details/$id",
		component: CharacterDetailsPage
		
	}, {
		path: "/",
		component: () => <div>Home</div>
	}]
	test("renders as expected",async ()=>{
		const { router } = render(<CharacterDetailsPage />, { routes });
		await act(() => {
			router.navigate({
				to: "/character-details/1",
			});
		})
		expect(screen.getByRole("heading", { name: /luke skywalker/i, level: 1 })).toBeInTheDocument();
		const profileSection = screen.getByRole("region", {name: /character profile/i})
		expect(profileSection).toBeInTheDocument();
		expect(within(profileSection).getByAltText(/luke skywalker/i)).toBeInTheDocument();
		expect(within(profileSection).getByRole("button", { name: /add to favourites/i })).toBeInTheDocument();

		expect(screen.getByRole("region", { name: /character details/i })).toBeInTheDocument();
		expect(screen.getByRole("region", { name: /featured movies/i })).toBeInTheDocument();
		expect(screen.getByRole("region", { name: /starships piloted/i })).toBeInTheDocument();
	})

	test("loads and displays character details", async () => {
		const { router } = render(<CharacterDetailsPage />, { routes });
		await act(() => {
			router.navigate({
				to: "/character-details/1",
			});
		})
		const detailsSection = screen.getByRole("region", { name: /character details/i });
		expect(detailsSection).toBeInTheDocument();

		const hairColorDetails = within(detailsSection).getByTestId("hair-colour")
		expect(within(hairColorDetails).getByText('Hair Colour')).toBeInTheDocument();
		expect(within(hairColorDetails).getByText('Black')).toBeInTheDocument();

		const eyeColorDetails = within(detailsSection).getByTestId("eye-colour")
		expect(within(eyeColorDetails).getByText('Eye Colour')).toBeInTheDocument();
		expect(within(eyeColorDetails).getByText('Brown')).toBeInTheDocument();

		const genderDetails = within(detailsSection).getByTestId("gender")
		expect(within(genderDetails).getByText('Gender')).toBeInTheDocument();
		expect(within(genderDetails).getByText('Male')).toBeInTheDocument();

		const homePlanetDetails = within(detailsSection).getByTestId("home-world")
		expect(within(homePlanetDetails).getByText('Home World')).toBeInTheDocument();
		expect(within(homePlanetDetails).getByText('Tatooine')).toBeInTheDocument();

	})


	test("loads and displays movies list", async ( )=>{
			const { router } = render(<CharacterDetailsPage />, { routes });
		await act(() => {
			router.navigate({
				to: "/character-details/1",
			});
		})

		const moviesSection = screen.getByRole("region", { name: /featured movies/i });
		expect(moviesSection).toBeInTheDocument();

		// const moviesList = within(moviesSection).getByRole("list")
		// expect(moviesList).toBeInTheDocument();

		const moviesListItems = within(moviesSection).getAllByRole("listitem")
		expect(moviesListItems.length).toBe(2);
		const movies = ["A New Hope", "The Empire Strikes Back"]
		movies.forEach((movie, idx) => {
			expect(within(moviesListItems[idx]).getByText(new RegExp(movie, 'i'))).toBeInTheDocument();
		})

	})

	test.only("loads and displays starships list", async ()=>{
	const { router } = render(<CharacterDetailsPage />, { routes });
		await act(() => {
			router.navigate({
				to: "/character-details/1",
			});
		})

		const starShipsSection = screen.getByRole("region", { name: /starships piloted/i });
		expect(starShipsSection).toBeInTheDocument();

		// const starShips = within(starShipsSection).getByRole("list")
		// expect(starShips).toBeInTheDocument();

		const starShipTags = within(starShipsSection).getAllByRole("listitem")
		expect(starShipTags.length).toBe(2);
		const starShips = ["X-Wing", "Millennium Falcon"]
		starShips.forEach((shipName, idx) => {
			expect(within(starShipTags[idx]).getByText(new RegExp(shipName, 'i'))).toBeInTheDocument();
		})
	})

	test("Favourite and unFavourite actions work as expected", async ()=>{
		const { router } = render(<CharacterDetailsPage />, { routes });
		await act(() => {
			router.navigate({
				to: "/character-details/1",
			});
		})

		const favouriteButton = screen.getByRole("button", { name: /add to favourites/i })
		expect(favouriteButton).toBeInTheDocument();
		expect(favouriteButton).toHaveAttribute("aria-pressed", "false");
		expect(favouriteButton).toHaveTextContent(/add to favourites/i);

		favouriteButton.click();
		expect(favouriteButton).toHaveAttribute("aria-pressed", "true");
		expect(favouriteButton).toHaveTextContent(/remove from favourites/i);

		favouriteButton.click();
		expect(favouriteButton).toHaveAttribute("aria-pressed", "false");
		expect(favouriteButton).toHaveTextContent(/add to favourites/i);
	})

	test("shows appropriate message when no data is available",()=>{})


	test("shows appropriate message when error responses are received",()=>{})

	

})