export type charactersListResponse = {
      results: {
        uid: string;
        name: string;
        url: string;
      }[];
      count: number;
      next: string | null;
      previous: string | null;
      message: "ok";
      total_pages: number;
      total_records: number;
    }


    type characterProperties = {
      created: string;
      edited: string;
      name: string;
      gender: string;
      skin_color: string;
      hair_color: string;
      height: string;
      eye_color: string;
      mass: string;
      homeworld: string;
      birth_year: string;
      url: string;
    }

export type charactersFilterRespsonse = {
  message: string;
  result: {
    properties: characterProperties;
    _id: string;
    description: string;
    uid: string;
    __v: number;
  }[];
  apiVersion: string;
  timestamp: string;
  support: object;
  social: object;
}

export type characterDetailsResponse = {message: string;
  result: {
    properties: characterProperties;
    _id: string;
    description: string;
    uid: string;
    __v: number;
  };
  apiVersion: string;
  timestamp: string;
  support: object;
  social: object;}



export function fetchCharacters(page: number, searchQuery: string, limit: number): Promise<charactersListResponse|charactersFilterRespsonse> {
  return fetch(
    `${import.meta.env.VITE_SWAPI_BASE_URL}/people?page=${page}&name=${searchQuery}&limit=${limit}`,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching characters:", error);
      throw error;
    });
}

export function fetchCharacterDetails(url: string): Promise<characterDetailsResponse> {
	return fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.catch((error) => {
			console.error("Error fetching character details:", error);
			throw error;
		});
}

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