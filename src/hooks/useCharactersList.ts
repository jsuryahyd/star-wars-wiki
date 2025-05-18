import { useMemo } from "react";
import {
  fetchCharacterDetails,
  fetchCharacters,
  fetchPlanet,
  type charactersFilterRespsonse,
  type charactersListResponse,
} from "@/pages/CharactersPage/CharactersPage.service";
import { useQueries, useQuery } from "@tanstack/react-query";
interface CharacterWithDetails {
  name: string;
  url: string;
  gender: string;
  homeworldName: string;
  uid: string;
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
          };
        }
        return res as charactersListResponse;
      }),
    // keepPreviousData: true,
    select: (data) => ({
      ...data,
      total: data?.count || 0, // Extract total count for pagination
    }),
    onSuccess: (data: any) => {
      if (data?.total) {
        // usePagination.setTotal(data.total);
      }
    },
  });

  const characterDetailsQueries = useQueries({
    queries:
      charactersData?.results?.map((character) => ({
        queryKey: ["characterDetails", character.url],
        queryFn: () => fetchCharacterDetails(character.url),
        enabled: !!character.url, // Only fetch if character URL exists
      })) ?? [],
  });

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
      return {
        name: character.name,
        url: character.url,
        uid: character.uid,
        gender:
          characterDetailsQueries[index]?.data?.result?.properties?.gender ||
          "Unknown",
        homeworldName:
          homeworldQueries[index]?.data?.result?.properties?.name || "Unknown",
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
    charactersWithDetails,
    refetch,
    initialError,
    charactersData,
    characterDetailsQueries,
    homeworldQueries,
    totalCharactersCount: charactersData?.total_records || 0,
    totalPagesCount: charactersData?.total_pages || 0,
  };
}
