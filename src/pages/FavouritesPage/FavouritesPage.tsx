import {
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  Menu,
  Spinner,
  Text,
  Portal,
} from "@chakra-ui/react";
import { SlRefresh } from "react-icons/sl";
import { capitalize } from "@/utils/utils";
import { CharacterCard } from "@/components/ui/CharacterCard/CharacterCard";
import useFavouritesList, {
  type favouritesListQueryResult,
} from "@/hooks/useFavouritesList";
import { LuX } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavourite, removeFavourite } from "@/services/services";
import SearchInput from "@/components/ui/SearchInput/SearchInput";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import type { favouriteCharacterDetails } from "./Favourites.service";

export default function FavouritesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const {
    isCharactersLoading,
    charactersWithDetails,
    isCharactersError,
    refetch,
  } = useFavouritesList();
  const { mutate } = useMutation({
    mutationFn: async (character: any) => {
      return removeFavourite(character.uid);
    },
    onSuccess: (response, character) => {
      toaster.success({
        title: "Removed from Favourites",
        description: `${character.name} removed from favourites`,
        // status: "success",
        action: {
          label: "Undo",
          onClick: () => {
            addFav(character);
          },
        },
        duration: 5000,
      });
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["isFavourite", character.uid],
      });
    },
    onError: () => {
      console.log("Error removing favourite");
    },
    onSettled: () => {
      // refetch();
    },
  });

  const { mutate: addFav } = useMutation({
    mutationFn: async (character: any) => {
      return addFavourite(character);
    },
    onSuccess: (response, character) => {
      toaster.success({
        title: "Added to Favourites",
        description: `${character.name} added back to favourites`,
      });
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["isFavourite", character.uid],
      }); //if we go to character details page, it should fetch the updated data
    },
    onError: () => {
      console.log("Error adding favourite");
    },
  });

  return (
    <Flex direction="column" align="center" margin="0 auto">
      <Flex mb={4} width="full" align="center">
        <SearchInput
          placeholder="Search by name"
          value={searchQuery}
          onChange={(value: string) => {
            setSearchQuery(value);
          }}
        />
      </Flex>
      <CharactersGrid
        charactersData={{
          isCharactersLoading,
          charactersWithDetails: charactersWithDetails?.filter((character) => {
            if (searchQuery === "") return true;
            return character.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          }),
          isCharactersError,
          refetch,
        }}
        onRemoveFavourite={(character: any) => {
          mutate(character);
        }}
      />
    </Flex>
  );
}

function CharactersGrid({
  charactersData,
  onRemoveFavourite,
}: {
  charactersData: favouritesListQueryResult;
  onRemoveFavourite: (character: favouriteCharacterDetails) => void;
}) {
  const {
    isCharactersLoading,
    charactersWithDetails,
    isCharactersError,
    refetch,
  } = charactersData;

  if (isCharactersLoading) {
    return (
      <Flex justify="center" align="center" height="80vh" role="progressbar">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isCharactersError) {
    return (
      <Box p={4} textAlign="center">
        <Text color="red.500">Error loading Favourites</Text>
        <Button mt={4} onClick={refetch}>
          <SlRefresh style={{ marginRight: 8 }} />
          Retry
        </Button>
      </Box>
    );
  }

  if (charactersWithDetails.length === 0) {
    return (
      <Box
        p={4}
        textAlign="center"
        minHeight="60vh"
        role="alert"
        width="full"
        alignContent={"center"}
      >
        <Text>No Favourites Yet</Text>
      </Box>
    );
  }

  return (
    <Grid
      as={"section"}
      aria-label="favourites list"
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
      }}
      gap={4}
      width="full"
    >
      {charactersWithDetails.map((character) => {
        if (!character) return null;
        return (
          <CharacterCard
            key={character.uid}
            name={character.name}
            avatarUrl={character.avatarUrl}
            details={[
              { label: "Gender", value: capitalize(character.gender) },
              { label: "Home Planet", value: character.homeWorld },
              { label: "Height", value: character.height + " cm" },
            ]}
            id={character.uid}
            renderTopRight={(id) => {
              return (
                <IconButton
                  aria-label="Remove from favourites"
                  variant="ghost"
                  colorScheme="red"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavourite(character);
                  }}
                >
                  <LuX />
                </IconButton>
              );
              // return (
              //   <Box>
              //     <Menu.Root>
              //       <Menu.Trigger asChild>
              //         <Button
              //           onClick={(e) => e.stopPropagation()}
              //           variant="ghost"
              //           size="sm"
              //         >
              //           <LuX />
              //         </Button>
              //       </Menu.Trigger>
              //       <Portal>
              //         <Menu.Positioner>
              //           <Menu.Content>
              //             <Menu.Item
              //               value="new-txt-a"
              //               onClick={() => {
              // 								e.stopPropagation();
              //                 onRemoveFavourite(id);
              //               }}
              //             >
              //               Remove from Favourites
              //             </Menu.Item>
              //           </Menu.Content>
              //         </Menu.Positioner>
              //       </Portal>
              //     </Menu.Root>
              //   </Box>
              // );
            }}
          />
        );
      })}
    </Grid>
  );
}
