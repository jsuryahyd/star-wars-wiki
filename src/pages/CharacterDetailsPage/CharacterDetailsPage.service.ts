export function getCharacterDetails(id: string) {
	return fetch(`${import.meta.env.VITE_SWAPI_BASE_URL}/people/${id}/`)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
}

export async function getFilm(filmUrl: string): Promise<any> {
	const response = await fetch(filmUrl);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
}

export async function getStarship(starshipUrl: string): Promise<any> {
	const response = await fetch(starshipUrl);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
}

export async function getIsFavourite(id: string): Promise<boolean> {
	const response = await fetch(`/api/favourites/is-favourite/${id}`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const data = await response.json();
	return data;
}
