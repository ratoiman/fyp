import React, { useState } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Box } from "@mui/material";
import { useMemo } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import Loading from "./Loading";
import "@reach/combobox/styles.css";

const GoogleMapsIntegration = (props) => {
  const [marker, setMarker] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_API_KEY_MAPS,
    libraries: ["places"],
  });

  const PlacesAutoComplete = () => {
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();

      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      props.setMarker({ lat, lng });
      // setMarker({ lat, lng });
    };

    return (
      <Combobox onSelect={handleSelect}>
        {" "}
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    );
  };

  if (!isLoaded) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  // {console.log("marker", props.marker)}
  else
    return (
      <>
        <Box>
          {" "}
          <Box className="places-container">
            {" "}
            <PlacesAutoComplete />{" "}
          </Box>
          <GoogleMap
            zoom={10}
            center={
              props.marker !== ""
                ? props.marker
                : { lat: 51.500942, lng: -0.177498 }
            }
            mapContainerClassName="map-container"
          >
            {" "}
            <Box>{props.marker && <MarkerF position={props.marker} />} </Box>
          </GoogleMap>
        </Box>{" "}
      </>
    );
};

export default GoogleMapsIntegration;
