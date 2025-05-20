import React from "react";
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
  Card,
  Spacer,
} from "@chakra-ui/react";

import { Link as RouterLink } from "@tanstack/react-router";

interface CharacterCardProps {
  name: string;
  avatarUrl?: string;
  details: { label: string; value: string }[];
  id: string;
  renderTopRight?: (id: string) => React.ReactNode;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  name,
  avatarUrl,
  details,
  id,
  renderTopRight,
}) => {
  // Extract the character ID from the URL (assuming SWAPI URL structure)

  return (
    <LinkBox
      as="article"
      rounded="md"
      shadow="sm"
      transition="transform 0.15s ease-in-out"
      _hover={{ transform: "scale(1.02)" }}
    >
      <Card.Root>
        <Box
          position="absolute"
          top="0.5rem"
          right="0.5rem"
          zIndex={1}
          onClick={e=>e.stopPropagation()}
        >
          {renderTopRight?.(id)}
        </Box>
        <LinkOverlay as={RouterLink} to={`${import.meta.env.BASE_URL}character-details/${id}`}>
          <Flex align="center" gap={4} p={4}>
            <Avatar.Root size="2xl" name={name}>
              <Avatar.Fallback />
              <Avatar.Image src={avatarUrl} />
            </Avatar.Root>
            <Stack spacing={1} width={"full"}>
              <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={0}>
                {name}
              </Heading>
              {details.map((detail) => (
                <Flex key={detail.label} justify="space-between" align="center">
                  <Text fontSize="xs" opacity={0.6} fontWeight="bold">
                  {detail.label}: 
                </Text>
                <Text fontSize="sm" >
                  {/* {detail.label}:  */}
                  {detail.value || "Unknown"}
                </Text>
                </Flex>
              ))}
            </Stack>
          </Flex>
        </LinkOverlay>
      </Card.Root>
    </LinkBox>
  );
};
