import React from 'react';
import {
  Box,
  Avatar,
  Heading,
  Text,
  Stack,
  LinkBox,
  LinkOverlay,
  IconButton,
  Flex,
} from '@chakra-ui/react';

import { Link as RouterLink } from '@tanstack/react-router';

interface CharacterCardProps {
  name: string;
  avatarUrl?: string;
  details: { label: string; value: string }[];
  id: string;
	renderTopRight?: (id:string) => React.ReactNode;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  name,
  avatarUrl,
  details,
	id,
	renderTopRight
}) => {
  // Extract the character ID from the URL (assuming SWAPI URL structure)
  

  return (
    <LinkBox
      as="article"
      rounded="md"
      shadow="sm"
      transition="transform 0.15s ease-in-out"
      _hover={{ transform: 'scale(1.02)' }}
    >
      <LinkOverlay as={RouterLink} to={`/characters/${id}`}>
			{renderTopRight?.(id)}
        <Flex align="center" gap={4} p={4}>
          {/* <Avatar src={avatarUrl} name={name} size="md" /> */}
					 <Avatar.Root size="2xl" name={name} >
    <Avatar.Fallback />
    <Avatar.Image src={avatarUrl} />
  </Avatar.Root>
          <Stack spacing={1}>
            <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={0}>
              {name}
            </Heading>
            {details.map((detail) => (
              <Text key={detail.label} fontSize="sm" color="gray.600">
                {/* {detail.label}:  */}
								{detail.value || 'Unknown'}
              </Text>
            ))}
          </Stack>
        </Flex>
      </LinkOverlay>
    </LinkBox>
  );
};