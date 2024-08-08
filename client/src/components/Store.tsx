// npm
import React from "react";
import styled from "styled-components";

// types
type StoreProps = {
  name: string;
  postcode: string;
  radius: number;
  handleRadiusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchRadius: () => void;
};

export const Store = ({
  name,
  postcode,
  radius,
  handleRadiusChange,
  searchRadius,
}: StoreProps) => {
  return (
    <StoreContainer>
      <h2>{name}</h2>
      <p>{postcode}</p>
      <SliderContainer>
        <label htmlFor="radius">Radius: {radius} miles</label>
        <Slider
          id="radius"
          type="range"
          min="5"
          max="50"
          value={radius}
          onChange={handleRadiusChange}
        />
        <Button onClick={searchRadius}>Search</Button>
      </SliderContainer>
    </StoreContainer>
  );
};

const StoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  max-width: 80%;
`;

const SliderContainer = styled.div`
  display: flex;
  align-content: center;
  gap: 10px;
`;

const Slider = styled.input`
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
`;
