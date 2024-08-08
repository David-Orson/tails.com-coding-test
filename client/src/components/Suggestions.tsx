// npm
import styled from "styled-components";

// types
import { Store } from "../App";

type SuggestionsProps = {
  displayedSuggestions: Store[];
  setStore: (store: Store) => void;
  setStores: (stores: Store[]) => void;
  setSuggestions: (suggestions: Store[]) => void;
  setDisplayedSuggestions: (displayedSuggestions: Store[]) => void;
  setQuery: (query: string) => void;
};

export const Suggestions = ({
  displayedSuggestions,
  setStore,
  setStores,
  setSuggestions,
  setDisplayedSuggestions,
  setQuery,
}: SuggestionsProps) => {
  return (
    <SuggestionsList id="suggestions-list">
      {displayedSuggestions.map((suggestion) => (
        <SuggestionItem
          key={suggestion.name}
          onClick={() => {
            setStore(suggestion);
            setStores([suggestion]);
            setSuggestions([]);
            setDisplayedSuggestions([]);
            setQuery("");
          }}
        >
          {suggestion.name} - {suggestion.postcode}
        </SuggestionItem>
      ))}
    </SuggestionsList>
  );
};

const SuggestionsList = styled.ul`
  list-style: none;
  background-color: white;
  max-height: 250px;
  width: 100%;
  overflow-y: scroll;
`;

const SuggestionItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 100px;

  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;
