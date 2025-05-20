import { useMemo } from "react";
import {
  fetchCharacterDetails,
  fetchCharacters,
  type charactersFilterRespsonse,
  type charactersListResponse,
} from "@/pages/CharactersPage/CharactersPage.service";
import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchPlanet } from "@/services/services";
interface CharacterWithDetails {
  name: string;
  url: string;
  gender: string;
  homeworldName: string;
  uid: string;
	imageUrl?: string
}

export default function useCharactersList({
  page,
  searchQuery,
  limit = 10,
}: any) {
  const {
    data: charactersData,
    isLoading: isInitialLoading,
    isError: isInitialError,
    error: initialError,
    refetch,
  } = useQuery({
    queryKey: ["characters", page, searchQuery, limit],
    queryFn: () =>
      fetchCharacters(page, searchQuery, limit).then((res) => {
        if (searchQuery) {
          return {
            results: (res as charactersFilterRespsonse).result.map((r) => {
              return {
                name: r.properties.name,
                url: r.properties.url,
                uid: r.uid || r.properties.uid,
              };
            }),
            total_pages: Math.ceil((res as charactersFilterRespsonse).result.length / limit),
            total_records: (res as charactersFilterRespsonse).result.length
          };
        }
        return res as charactersListResponse;
      })
  });

  //todo: instead extract unique urls, maintain in a Map() and merge the data
  const characterDetailsQueries = useQueries({
    queries:
      charactersData?.results?.map((character) => ({
        queryKey: ["characterDetails", character.url],
        queryFn: () => fetchCharacterDetails(character.url),
        enabled: !!character.url, // Only fetch if character URL exists
      })) ?? [],
  });

  //todo: instead extract unique urls, maintain in a Map() and merge the data
  const homeworldQueries = useQueries({
    queries:
      characterDetailsQueries.map((res) => {
        // console.log('result', res);
        const homeWorldUrl = res.data?.result?.properties?.homeworld;
        return {
          queryKey: ["homeworld", homeWorldUrl],
          queryFn: () => fetchPlanet(homeWorldUrl),
          enabled: !!homeWorldUrl, // Only fetch if homeworld URL exists
        };
      }) ?? [],
  });

  // Combine the data
  const charactersWithDetails: CharacterWithDetails[] = useMemo(() => {
    return (charactersData?.results || []).map((character, index) => {
			let gender = characterDetailsQueries[index]?.data?.result?.properties?.gender
			if(gender === 'n/a') {
				gender = "N/A"
			}
      return {
        name: character.name,
        url: character.url,
        uid: character.uid,
        gender:
          gender ||
          "Unknown",
        homeworldName:
          homeworldQueries[index]?.data?.result?.properties?.name || "Unknown",
					imageUrl:import.meta.env.BASE_URL + 'assets/images/'+character.uid+'.png'
      };
    });
  }, [charactersData?.results, characterDetailsQueries, homeworldQueries]);

  const isCharactersLoading =
    isInitialLoading ||
    characterDetailsQueries.some((query) => query.isLoading) ||
    homeworldQueries.some((query) => query.isLoading);

  const isCharactersError =
    isInitialError ||
    characterDetailsQueries.some((query) => query.isError) ||
    homeworldQueries.some((query) => query.isError);

  return {
    isCharactersError,
    isCharactersLoading,
    charactersWithDetails: charactersWithDetails || [],
    refetch,
    initialError,
    charactersData,
    characterDetailsQueries,
    homeworldQueries,
    totalCharactersCount: charactersData?.total_records || 0,
    totalPagesCount: charactersData?.total_pages || 0,
  };
}
