// npm
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

// mapbox
import ReactMapGL, { MapRef, Marker, ViewStateChangeEvent } from "react-map-gl";
import { FitBoundsOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// components
import { MarkerIcon } from "./MarkerIcon";

// types
import { Store } from "../App";

export const Map: React.FC<{ stores: Store[] }> = ({ stores }) => {
  const [viewport, setViewport] = useState({
    latitude: 51.5074,
    longitude: -0.1278,
    zoom: 10,
    width: "100%",
    height: "100%",
  });

  const mapRef = useRef<MapRef>(null);

  const handleViewportChange = (newViewport: ViewStateChangeEvent) => {
    setViewport({
      latitude: newViewport.viewState.latitude,
      longitude: newViewport.viewState.longitude,
      zoom: newViewport.viewState.zoom,
      width: "100%",
      height: "100%",
    });
  };

  useEffect(() => {
    if (stores.length > 1) {
      const bounds = stores.reduce(
        (acc, store) => {
          return {
            minLat: Math.min(acc.minLat, store.latitude || acc.minLat),
            maxLat: Math.max(acc.maxLat, store.latitude || acc.maxLat),
            minLon: Math.min(acc.minLon, store.longitude || acc.minLon),
            maxLon: Math.max(acc.maxLon, store.longitude || acc.maxLon),
          };
        },
        {
          minLat: Infinity,
          maxLat: -Infinity,
          minLon: Infinity,
          maxLon: -Infinity,
        },
      );

      const padding: FitBoundsOptions = { padding: 20 };

      if (mapRef.current) {
        mapRef.current.fitBounds(
          [
            [bounds.minLon, bounds.minLat],
            [bounds.maxLon, bounds.maxLat],
          ],
          padding,
        );
      }
    } else if (stores.length === 1) {
      setViewport({
        latitude: stores[0].latitude!,
        longitude: stores[0].longitude!,
        zoom: 12,
        width: "100%",
        height: "100%",
      });
    }
  }, [stores]);

  return (
    <MapContainer>
      <ReactMapGL
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onMove={handleViewportChange}
        mapStyle="mapbox://styles/mapbox/standard"
        ref={mapRef}
      >
        {stores?.map((store) => (
          <Marker
            key={store.postcode}
            latitude={store.latitude!}
            longitude={store.longitude!}
            offset={[0, 0]}
          >
            <MarkerWrapper>
              <MarkerIcon />
            </MarkerWrapper>
          </Marker>
        ))}
      </ReactMapGL>
    </MapContainer>
  );
};

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const MarkerWrapper = styled.div`
  color: red;
  font-size: 48px;
  padding-top: -20px;
`;
