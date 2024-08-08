// npm
import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";

// components
import { Map } from "./components/Map";
import { Store } from "./components/Store";
import { Suggestions } from "./components/Suggestions";

// types
export interface Store {
  name: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}

// data
//const url = "https://api.davidorson.tech";
const url = "http://localhost:5000";

export const App = () => {
  // state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Store[]>([]);
  const [displayedSuggestions, setDisplayedSuggestions] = useState<Store[]>([]);
  const [store, setStore] = useState<Store>();
  const [hasMore, setHasMore] = useState(true);
  const [radius, setRadius] = useState(10);
  const [stores, setStores] = useState<Store[]>([]);

  // methods
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const handleRadiusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };

  const searchRadius = async () => {
    try {
      const res = await axios.get(
        `${url}/api/stores/radius?postcode=${store!.postcode}&radius=${radius}`,
      );
      setStores(res.data);
      setSuggestions(res.data);
      setDisplayedSuggestions(res.data.slice(0, 3));
      setHasMore(res.data.length > 3);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScroll = useCallback(() => {
    const suggestionsList = document.getElementById("suggestions-list");
    if (suggestionsList) {
      const { scrollTop, scrollHeight, clientHeight } = suggestionsList;
      if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
        setDisplayedSuggestions((prev) => {
          const newIndex = prev.length + 3;
          const newSuggestions = suggestions.slice(0, newIndex);
          setHasMore(newIndex < suggestions.length);
          return newSuggestions;
        });
      }
    }
  }, [hasMore, suggestions]);

  // watchers
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length < 2) {
        setSuggestions([]);
        setDisplayedSuggestions([]);
        return;
      }
      axios
        .get(`${url}/api/stores?query=${query}`)
        .then((res) => {
          setSuggestions(res.data);
          setDisplayedSuggestions(res.data.slice(0, 3)); // Show first 3 results
          setHasMore(res.data.length > 3); // Check if there are more than 3 results
        })
        .catch((error) => {
          console.error(error);
        });
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const suggestionsList = document.getElementById("suggestions-list");
    if (suggestionsList) {
      suggestionsList.addEventListener("scroll", handleScroll);
      return () => suggestionsList.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // render
  return (
    <Body>
      <Container>
        <Title>Find a store</Title>
        <SearchInput
          placeholder="Search for a store"
          value={query}
          onChange={handleInput}
        />
        {displayedSuggestions.length > 0 && (
          <Suggestions
            displayedSuggestions={displayedSuggestions}
            setStore={setStore}
            setStores={setStores}
            setSuggestions={setSuggestions}
            setDisplayedSuggestions={setDisplayedSuggestions}
            setQuery={setQuery}
          />
        )}
        {store && (
          <Store
            name={store.name}
            postcode={store.postcode}
            radius={radius}
            searchRadius={searchRadius}
            handleRadiusChange={handleRadiusChange}
          />
        )}
      </Container>
      <Map stores={stores} />
    </Body>
  );
};

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  @media (min-width: 768px) {
    width: 60%;
  }
`;

const Title = styled.h1`
  margin-top: 20px;
  font-size: 24px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 80%;
  margin-bottom: 10px;
`;
