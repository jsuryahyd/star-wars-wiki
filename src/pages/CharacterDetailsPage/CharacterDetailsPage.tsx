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
  Editable,
  IconButton,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useCharacterDetails from "@/hooks/useCharacterDetails";
import { useParams, useRouter } from "@tanstack/react-router";
import { capitalize } from "@/utils/utils";
import { getIsFavourite } from "./CharacterDetailsPage.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavourite, removeFavourite } from "@/services/services";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";
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
  const router = useRouter()
  const { data: isFavourite, refetch } = useQuery({
    queryKey: ["isFavourite", id],
    queryFn: () => getIsFavourite(id),
    enabled: !!id,
  });
  const queryClient = useQueryClient();
  const { mutate, isPending: isFavUpdating } = useMutation({
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
    onError: (err, action) => {
      toaster.error({
        title: "Error",
        description: action.addFav
          ? "An Error occured while adding the character to Favourites."
          : "An Error occured while removing the character from Favourites.",
      });
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
    return (
      <Box  height="60vh" justifyContent={'center'} alignItems={'center'}  flexDirection={"column"}>
        <Text color="red.500">Error loading character details</Text>
        <Button mt={4} onClick={() => router.navigate({ to: "/characters-list" })}>
          Go Back
        </Button>
      </Box>
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
              if ((e.nativeEvent?.target as HTMLImageElement)?.src)
                e.nativeEvent.target.src =
                  import.meta.env.BASE_URL + "assets/images/avatar-default.svg";
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
              {details.map((detail, idx) => {
                const testid = detail.label.replace(/\s+/g, "-").toLowerCase();
                return (
                  <React.Fragment key={detail.label}>
                    <GridItem data-testid={testid}>
                      <Text fontWeight="bold" fontSize="xs" opacity={0.6}>
                        {detail.label}
                      </Text>
                      {testid === "hair-colour" || testid === "weight" ? (
                        <EditableText
                          value={capitalize(detail.value) || "Unknown"}
                        />
                      ) : (
                        <Text fontSize="md">
                          {capitalize(detail.value) || "Unknown"}
                        </Text>
                      )}
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
              {featuredFilms.map((movie) => (
                <Tag.Root
                  key={movie}
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

function EditableText({ value }) {
  return (
    <Editable.Root
      defaultValue="Click to edit"
      onValueChange={(e) => {
        // console.log(e.value);
      }}
      submitMode="enter"
      placeholder="Click to edit"
      value={value}
      onValueCommit={(e) => {
        // alert("Not Implemented")
        toaster.create({
          title: "Coming Soon",
          description: "This feature will be available soon.",
        });
      }}
    >
      <Editable.Preview />
      <Editable.Input />
      <Editable.Control>
        <Editable.EditTrigger asChild>
          <IconButton variant="ghost" size="xs">
            <LuPencilLine />
          </IconButton>
        </Editable.EditTrigger>
        <Editable.CancelTrigger asChild>
          <IconButton variant="outline" size="xs">
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>
        <Editable.SubmitTrigger asChild>
          <IconButton variant="outline" size="xs">
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
      </Editable.Control>
    </Editable.Root>
  );
}
