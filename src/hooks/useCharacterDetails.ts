import {
  getCharacterDetails,
  getFilm,
  getStarship,
} from "@/pages/CharacterDetailsPage/CharacterDetailsPage.service";
import { fetchPlanet } from "@/services/services";
import { randomItemsFrom } from "@/utils/utils";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useCharacterDetails(id: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["characterDetails", id],
    queryFn: () => getCharacterDetails(id),
  });
  let characterDetails = data
    ? {
        ...data.result.properties,
        uid: data.result.uid,
        description: data.result.description,
      }
    : null;
  // Fetch films and starships if characterDetails is available
  const filmUrls = characterDetails?.films || [];
  const starshipUrls = characterDetails?.starships || [];

  const filmQueries = useQueries({
    queries: filmUrls.map((url: string) => ({
      queryKey: ["film", url],
      queryFn: () => getFilm(url),
      enabled: !!url,
    })),
  });

  const starshipQueries = useQueries({
    queries: starshipUrls.map((url: string) => ({
      queryKey: ["starship", url],
      queryFn: () => getStarship(url),
      enabled: !!url,
    })),
  });

  const homeWorldQuery = useQuery({
    queryKey: ["homeworld", characterDetails?.homeworld],
    queryFn: () => {
      if (characterDetails?.homeworld) {
        return fetchPlanet(characterDetails.homeworld);
      }
      return null;
    },
    enabled: !!characterDetails?.homeworld,
  });

	const randomMovies = useMemo(()=>{
		return randomItemsFrom([
          "A New Hope",
          "The Empire Strikes Back",
          "Return of the Jedi",
          "The Phantom Menace",
          "Attack of the Clones",
          "Revenge of the Sith",
          "The Clone Wars",
          "The Force Awakens",
          "The Last Jedi",
          "The Rise of Skywalker",
        ])
	}, [])

	const randomStarships = useMemo(()=>{
		return randomItemsFrom([
          "X-Wing",
          "TIE Fighter",
          "Millennium Falcon",
          "Star Destroyer",
          "Slave I",
          "Imperial Shuttle",
          "A-Wing",
          "B-Wing",
          "Y-Wing",
          "Naboo Starfighter",
        ])
	},[])

  // Merge films and starships data into characterDetails

  if (characterDetails) {
    characterDetails.avatarUrl = `${import.meta.env.BASE_URL}assets/images/${id}.png`;
    characterDetails.featuredFilms = filmQueries
      .map((q) => q.data?.result?.properties?.title)
      .filter(Boolean);
    characterDetails.starshipsPiloted = starshipQueries
      .map((q) => q.data?.result?.properties?.name)
      .filter(Boolean);

    //static data since swapi does not return films and starships anymore
    characterDetails.featuredFilms = characterDetails.featuredFilms.length
      ? characterDetails.featuredFilms
      : randomMovies;
    characterDetails.starshipsPiloted = characterDetails.starshipsPiloted.length
      ? characterDetails.starshipsPiloted
      : randomStarships;

    characterDetails.homeworldName =
      homeWorldQuery.data?.result?.properties?.name || "Unknown";
    characterDetails.details = [
      {
        label: "Home World",
        value: characterDetails.homeworldName,
      },
      {
        label: "Hair Colour",
        value:
          characterDetails.hair_color === "n/a"
            ? "N/A"
            : characterDetails.hair_color || "Unknown",
      },
      { label: "Eye Colour", value: characterDetails.eye_color || "Unknown" },
      {
        label: "Height",
        value: characterDetails.height
          ? `${characterDetails.height} cm`
          : "Unknown",
      },
      {
        label: "Weight",
        value: characterDetails.mass
          ? `${characterDetails.mass} kg`
          : "Unknown",
      },
      {
        label: "Gender",
        value:
          characterDetails.gender === "n/a"
            ? "N/A"
            : characterDetails.gender || "Unknown",
      },
      { label: "Birth Year", value: characterDetails.birth_year || "Unknown" },
    ];
  }

  const anyFilmError = filmQueries.some((q) => q.error);
  const anyStarshipError = starshipQueries.some((q) => q.error);

  return {
    characterDetails: error ? null : characterDetails,
    error:
      error ||
      (anyFilmError ? "One or more films failed to load" : null) ||
      (anyStarshipError ? "One or more starships failed to load" : null),
    isLoading,
  };
}
