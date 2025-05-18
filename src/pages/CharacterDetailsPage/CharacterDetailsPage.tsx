import React from 'react';
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
} from '@chakra-ui/react';
import { FaRegHeart } from 'react-icons/fa';

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


	const {
		name,
		profilePictureUrl,
		description,
		favoriteMovies,
		favoriteStarships,
		details,
		onAddToFavorites,
		characterId,
	} = {name: "Luke Skywalker", profilePictureUrl: "/assets/images/1.png", description: "Jedi Master", favoriteMovies: ["A New Hope", "The Empire Strikes Back"], favoriteStarships: ["X-Wing", "Millennium Falcon"], details: [{ label: "Species", value: "Human" }, { label: "Home World", value: "Tatooine" }, { label: "Hair Colour", value: "Black" }, { label: "Gender", value: "Male" }, { label: "Eye Colour", value: "Brown" }], onAddToFavorites: (id) => console.log(`Added ${id} to favorites`), characterId: "1" };

  return (
   <Grid
  templateColumns={{ base: '1fr', md: '1fr 2fr' }}
  gap={6}
  width="full"
> <GridItem>
      {/* Profile Section */}
      <Box as="section" textAlign="center" mb={8} p={6} aria-label="character profile">
        <Image
    src={"/assets/images/avatar-default.svg"}
    boxSize="80%"
    borderRadius="full"
    fit="cover"
    alt={name}
		style={{backgroundColor:"white", margin:"auto"}}
  />
        <Heading as="h1" size="3xl" fontWeight="bold" mt={6}>
          {name}
        </Heading>
        {description && (
          <Text fontSize="md" color="gray.600" mt={2}>
            {description}
          </Text>
        )}
        {onAddToFavorites && (
          <Button
            
            colorScheme="yellow"
            size="md"
            mt={4}
            onClick={() => onAddToFavorites(characterId)}
          >
            <FaRegHeart  /> Add to Favourites
          </Button>
        )}
      </Box>
</GridItem>
      {/* <Divider mb={6} /> */}

      {/* Details Section */}
			<GridItem>
      <Card.Root as="section" width="full" mb={6} p={6} aria-label="character details">
        <Heading as="h3" size="lg" mb={4} >
          Details
        </Heading>
        {details && details.length > 0 ? (
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
            {details.map((detail) => {
							const testid = detail.label.replace(/\s+/g, '-').toLowerCase();
							return (
								<React.Fragment key={detail.label}>
									<GridItem data-testid={testid}>
										<Text fontWeight="bold" fontSize="xs" opacity={0.6}>
											{detail.label}
										</Text>
										<Text fontSize="md" >
											{detail.value || 'Unknown'}
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
      {favoriteMovies && favoriteMovies.length > 0 && (
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
					<Wrap spacing={2}>
						{favoriteMovies.map((movie, index) => (
							<Tag.Root key={index} colorScheme="blue" size="lg" role="listitem">
					<Tag.Label>{movie}</Tag.Label>
							</Tag.Root>
						))}
					</Wrap>
				</Card.Root>
      )}

      {/* Favorite Starships Section */}
      {favoriteStarships && favoriteStarships.length > 0 && (
        <Card.Root as="section" width="full" mb={6} p={6} aria-labelledby="starships-piloted-heading">
          <Heading as="h3" size="lg" mb={4} id="starships-piloted-heading">
            Starships Piloted
          </Heading>
          <Wrap spacing={2}>
            {favoriteStarships.map((starship, index) => (
              <Tag.Root key={index} colorScheme="purple" size="lg" role="listitem">
                <Tag.Label>{starship}</Tag.Label>
              </Tag.Root>
            ))}
          </Wrap>
        </Card.Root>
      )}
    </GridItem>
		</Grid>
  );
};

export default CharacterDetails;