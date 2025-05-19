export type favouriteCharacterDetails = {
  uid: string;
  name: string;
  url: string;
  gender: string;
  homeWorld: string;
  height: string;
};

export function fetchFavourites():Promise<favouriteCharacterDetails[]> {
  return fetch(import.meta.env.BASE_URL + "api/favourites")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
