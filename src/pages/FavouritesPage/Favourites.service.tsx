export function fetchFavourites() {
	return fetch('/api/favourites')
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.catch((error) => {
			console.error('There was a problem with the fetch operation:', error);
		});
}

export function removeFavourite(id:string){
	return fetch(`/api/favourites/${id}`, {
		method: 'DELETE',
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.catch((error) => {
			console.error('There was a problem with the fetch operation:', error);
		});
}