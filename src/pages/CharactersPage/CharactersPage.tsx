import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Flex,
  Text,
  IconButton,
  Spinner,
  usePrevious,
} from "@chakra-ui/react";
import { SlRefresh } from "react-icons/sl";
import { CharacterCard } from "@/components/ui/CharacterCard/CharacterCard";

import { useRouter } from "@tanstack/react-router";
import Pagination from "@/components/ui/Pagination/Pagination";
import { capitalize } from "@/utils/utils";
import { useWindowSize } from "usehooks-ts";
import useCharactersList from "@/hooks/useCharactersList";
import SearchInput from "@/components/ui/SearchInput/SearchInput";
import { LuRefreshCw } from "react-icons/lu";

const CharactersPage = () => {
  const router = useRouter();
  const windowSize = useWindowSize();
  const itemsPerPage = windowSize.width > 768 ? 12 : 10;
  
  const initialSearchQuery = router?.latestLocation?.search?.name || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const initialPageNum = parseInt(router.latestLocation.search.page || "1", 10);
  const [page, setPage] = useState(initialPageNum);

  const {
    isCharactersLoading,
    charactersWithDetails,
    isCharactersError,
    totalCharactersCount,
    refetch,
    totalPagesCount,
  } = useCharactersList({ page, searchQuery, limit: itemsPerPage });
  const prevSearchQuery = usePrevious(searchQuery);
  useEffect(() => {
    const queryParams:{name?:string, page?:number} = { page };
    if (prevSearchQuery != undefined && prevSearchQuery !== searchQuery) {
      setPage(1);
      queryParams.page = 1;
    }
    if (searchQuery) {
      queryParams.name = searchQuery;
    }
    router.navigate({
      search: queryParams as any,
    });
  }, [searchQuery, page, router, prevSearchQuery]);

  const handleRefresh = () => {
    if (searchQuery !== "") {
      setSearchQuery("");
    } else {
      refetch();
    }
  };

  return (
    <Flex direction="column" align="center" margin="0 auto">
      {/* Search Bar and Refresh Button */}
      <Flex mb={4} width="full" align="center">
        <SearchInput
          onChange={(value) => setSearchQuery(value)}
          value={initialSearchQuery}
          placeholder="Search by characters name"
          mr={2}
        />
        <IconButton
          aria-label="Refresh character list"
          variant="ghost"
          onClick={handleRefresh}
        >
          <LuRefreshCw />
        </IconButton>
      </Flex>

      <CharactersGrid
        charactersData={{
          isCharactersLoading,
          charactersWithDetails,
          isCharactersError,
          refetch,
        }}
      />
      {totalPagesCount > 1 && !isCharactersLoading && (
        <Flex mt={8} justify="flex-end" width="full">
          <Pagination
            count={totalCharactersCount}
            pageSize={itemsPerPage}
            defaultPage={page}
            onPageChange={({ page, pageSize }) => {
              setPage(page);
            }}
          />
        </Flex>
      )}
    </Flex>
  );
};

function CharactersGrid({ charactersData }: any) {
  const {
    isCharactersLoading,
    charactersWithDetails,
    isCharactersError,
    refetch,
  } = charactersData;

  if (isCharactersLoading) {
    return (
      <Flex justify="center" align="center" height="60vh" role="progressbar">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isCharactersError) {
    return (
      <Box p={4} textAlign="center">
        <Text color="red.500">Error loading characters</Text>
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
        <Text>No characters found</Text>
      </Box>
    );
  }

  return (
    <Grid
      as={"section"}
      aria-label="characters list"
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
            avatarUrl={character.imageUrl}
            name={character.name}
            details={[
              { label: "Gender", value: capitalize(character.gender) },
              { label: "Home Planet", value: character.homeworldName },
            ]}
            id={character.uid}
          />
        );
      })}
    </Grid>
  );
}

export default CharactersPage;
