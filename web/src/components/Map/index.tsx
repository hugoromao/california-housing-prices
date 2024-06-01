"use client";

import { useState } from "react";
import Map, { Layer, Marker, Source } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { FillLayer, LineLayer } from "mapbox-gl";
import Image from "next/image";

type Marker = {
  longitude: number;
  latitude: number;
};

const stateFills: FillLayer = {
  id: "state-fills",
  type: "fill",
  source: "states",
  layout: {},
  paint: {
    "fill-color": "#338EF7",
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.5,
    ],
  },
};

const stateBorders: LineLayer = {
  id: "state-borders",
  type: "line",
  source: "states",
  layout: {},
  paint: {
    "line-color": "#338EF7",
    "line-width": 2,
  },
};

type CaliforniaMapProps = {
  onSetMarker: (p: { longitude: number; latitude: number }) => void;
};

const CaliforniaMap = ({ onSetMarker }: CaliforniaMapProps) => {
  const [marker, setMarker] = useState<undefined | Marker>();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleClick = ({
    lngLat: { lat, lng },
  }: mapboxgl.MapLayerMouseEvent) => {
    setMarker({ longitude: lng, latitude: lat });
    onSetMarker({ longitude: lng, latitude: lat });
  };
  return (
    <>
      <Map
        cursor="default"
        dragPan={false}
        scrollZoom={false}
        doubleClickZoom={false}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: -119.417931,
          latitude: 36.978259,
          zoom: 4.1,
        }}
        onClick={handleClick}
        onLoad={() => setIsMapLoaded(true)}
        style={{ width: '100%', height:'50vh' }}
        mapStyle="mapbox://styles/mapbox/standard"
      >
        {marker ? (
          <Marker
            color="#45D483"
            longitude={marker.longitude}
            latitude={marker.latitude}
          />
        ) : null}

        {isMapLoaded ? (
          <Source id="states" type="geojson" data="/states.json">
            <Layer {...stateFills} />
            <Layer {...stateBorders} />
          </Source>
        ) : null}
      </Map>
    </>
  );
};

export default CaliforniaMap;
