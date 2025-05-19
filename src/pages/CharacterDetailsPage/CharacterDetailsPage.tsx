import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  Stack,
  List,
  ListItem,
  Badge,
  Flex,
  Button,
  Card,
  Grid,
  GridItem,
  Tag,
  Wrap,
  Spinner,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useCharacterDetails from "@/hooks/useCharacterDetails";
import { useParams, useRouter } from "@tanstack/react-router";
import { capitalize } from "@/utils/utils";
import { getIsFavourite } from "./CharacterDetailsPage.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavourite, removeFavourite } from "@/services/services";

interface CharacterDetailsProps {
  name: string;
  profilePictureUrl?: string;
  additionalInfo?: string;
  favoriteMovies?: string[];
  favoriteStarships?: string[];
  details?: { label: string; value: string }[];
  onAddToFavorites?: (characterId: string) => void;
  characterId: string;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = () => {
  const { id } = useParams({ strict: false });
  const { characterDetails, error, isLoading } = useCharacterDetails(id);

  const { data: isFavourite, refetch } = useQuery({
    queryKey: ["isFavourite", id],
    queryFn: () => getIsFavourite(id),
    enabled: !!id,
  });
  const queryClient = useQueryClient()
  const { mutate, isPending:isFavUpdating } = useMutation({
    mutationFn: async ({ id, addFav }: { id: string; addFav: boolean }) => {
      return addFav
        ? addFavourite({
            uid: id,
            name: characterDetails.name,
            url: characterDetails.url,
            gender: characterDetails.gender,
            homeWorld: characterDetails.homeworldName,
            height: characterDetails.height,
          })
        : removeFavourite(id);
    },
    onSuccess: () => {
      console.log("Removed from favourites");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: () => {
      console.log("Error removing from favourites");
    },
  });

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    console.error("Error loading character details:", error);
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500">Error loading character details</Text>
        <Button mt={4} onClick={() => router.navigate({ to: "/characters" })}>
          Go Back
        </Button>
      </Flex>
    );
  }

  const {
    name,
    avatarUrl,
    description,
    featuredFilms,
    starshipsPiloted,
    details,
    onAddToFavorites,
    characterId,
  } = characterDetails;

  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6} width="full">
      {" "}
      <GridItem>
        {/* Profile Section */}
        <Box
          as="section"
          textAlign="center"
          mb={8}
          p={6}
          aria-label="character profile"
        >
          <Image
            src={avatarUrl}
            boxSize="300px"
            borderRadius="full"
            fit="cover"
            alt={name}
            onError={(e) => {
              if((e.nativeEvent?.target as HTMLImageElement)?.src)
                e.nativeEvent.target.src = import.meta.env.BASE_URL+ "assets/images/avatar-default.svg";
            }}
            style={{ backgroundColor: "white", margin: "auto" }}
          />
          <Heading as="h1" size="3xl" fontWeight="bold" mt={6}>
            {name}
          </Heading>
          {description && (
            <Text fontSize="md" color="gray.600" mt={2}>
              {description}
            </Text>
          )}
          {isFavourite ? (
            <Button
              
              size="md"
              mt={4}
              onClick={() => mutate({ id, addFav: false })}
              disabled={isFavUpdating}
            >
              <FaHeart /> My Favourite
            </Button>
          ) : (
            <Button
              variant={"outline"}
              size="md"
              mt={4}
              onClick={() => mutate({ id, addFav: true })}
              disabled={isFavUpdating}
            >
              <FaRegHeart /> Add to Favourites
            </Button>
          )}
        </Box>
      </GridItem>
      {/* <Divider mb={6} /> */}
      {/* Details Section */}
      <GridItem>
        <Card.Root
          as="section"
          width="full"
          mb={6}
          p={6}
          aria-label="character details"
        >
          <Heading as="h3" size="lg" mb={4}>
            Details
          </Heading>
          {details && details.length > 0 ? (
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={4}
            >
              {details.map((detail) => {
                const testid = detail.label.replace(/\s+/g, "-").toLowerCase();
                return (
                  <React.Fragment key={detail.label}>
                    <GridItem data-testid={testid}>
                      <Text fontWeight="bold" fontSize="xs" opacity={0.6}>
                        {detail.label}
                      </Text>
                      <Text fontSize="md">
                        {capitalize(detail.value) || "Unknown"}
                      </Text>
                    </GridItem>
                  </React.Fragment>
                );
              })}
            </Grid>
          ) : (
            <Text color="gray.500">No additional details available.</Text>
          )}
        </Card.Root>

        {/* Favorite Movies Section */}
        <Card.Root
          as="section"
          width="full"
          mb={6}
          p={6}
          aria-labelledby="favorite-movies-heading"
        >
          <Heading as="h3" size="lg" mb={4} id="favorite-movies-heading">
            Featured Movies
          </Heading>
          {featuredFilms && featuredFilms.length > 0 ? (
            <Wrap spacing={2}>
              {featuredFilms.map((movie, index) => (
                <Tag.Root
                  key={index}
                  colorScheme="blue"
                  size="lg"
                  role="listitem"
                >
                  <Tag.Label>{movie}</Tag.Label>
                </Tag.Root>
              ))}
            </Wrap>
          ) : (
            <Text fontSize="sm">No Featured Movies</Text>
          )}
        </Card.Root>

        {/* Favorite Starships Section */}
        <Card.Root
          as="section"
          width="full"
          mb={6}
          p={6}
          aria-labelledby="starships-piloted-heading"
        >
          <Heading as="h3" size="lg" mb={4} id="starships-piloted-heading">
            Starships Piloted
          </Heading>
          {starshipsPiloted && starshipsPiloted.length > 0 ? (
            <Wrap spacing={2}>
              {starshipsPiloted.map((starship: string) => (
                <Tag.Root
                  key={starship}
                  colorScheme="purple"
                  size="lg"
                  role="listitem"
                >
                  <Tag.Label>{starship}</Tag.Label>
                </Tag.Root>
              ))}
            </Wrap>
          ) : (
            <Text fontSize="sm">No Starships piloted</Text>
          )}
        </Card.Root>
      </GridItem>
    </Grid>
  );
};

export default CharacterDetails;
