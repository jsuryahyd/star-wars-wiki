import { Button, Group, Input } from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import { useDebounceValue } from "usehooks-ts";
type SearchInputProps = {
	onChange: (value: string) => void;
	placeholder?: string;
	value: string;
}
/**
 *
 */
export default function SearchInput({ onChange, placeholder, value }: SearchInputProps) {
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue(value, 500);
  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value)
      inputRef.current.value = value;
  }, [value]);
  useEffect(() => {
    debouncedQuery !== value && onChange(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <Group attached w="full" mr={2}>
      <Input
        flex="1"
        placeholder={placeholder}
        onChange={(e) => setDebouncedQuery(e.target.value)}
        ref={inputRef}
				type="search"
      />
      {/* <Button bg="bg.subtle" variant="outline">
        <LuSearch />
      </Button> */}
    </Group>
  );
}