export function fetchPlanet(url: string): Promise<{result: {properties: any, uid: string, description: string}}> {
	return fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.catch((error) => {
			console.error("Error fetching planet details:", error);
			throw error;
		});
}


export function removeFavourite(id:string){
	return fetch(`${import.meta.env.BASE_URL}api/favourites/${id}`, {
		method: 'DELETE',
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
}

export function addFavourite(favourite: {uid: string, name: string, url?: string,gender: string, homeWorld: string, height: string}) {
	return fetch(import.meta.env.BASE_URL + 'api/favourites', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(favourite),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
}