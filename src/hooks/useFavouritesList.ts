import {
  fetchFavourites,
  type favouriteCharacterDetails,
} from "@/pages/FavouritesPage/Favourites.service";
import { useQuery } from "@tanstack/react-query";

export type favouritesListQueryResult = {
  isCharactersLoading: boolean;
  charactersWithDetails: (favouriteCharacterDetails & {
    avatarUrl: string;
  })[];
  isCharactersError: boolean;
  refetch: () => void;
};

export default function useFavouritesList(): favouritesListQueryResult {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["favourites"],
    queryFn: async () => {
      return fetchFavourites();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    isCharactersLoading: isLoading,
    charactersWithDetails: isError
      ? []
      : (data ?? []).map((c) => ({
          ...c,
          avatarUrl:
            import.meta.env.BASE_URL + "assets/images/" + c.uid + ".png",
        })),
    isCharactersError: isError,
    refetch,
  };
}
