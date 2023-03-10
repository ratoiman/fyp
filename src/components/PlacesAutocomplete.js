import React from "react";
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
import { Box, Stack } from "@mui/material";
import { StyledTextField } from "../ui_styles/MuiStyles";

// todo:: uncommented ready in ComboboxInput as it was disabling the component without enabling it, might cause some problems

const PlacesAutocomplete = (props) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    props.setLocationString(address)
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    props.setMarker({ lat, lng });
  };

  return (
    <Stack direction="row" sx={{ display: "flex", width: "100%" }}>
      <Box className="combobox-container">
        <Combobox onSelect={handleSelect} className="combobox">
          {" "}
          <ComboboxInput
            className="combobox-input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              props.setLocationString(e.target.value);
            }}
            // disabled={!ready}
            placeholder="Location"
          />
          <ComboboxPopover portal={false}>
            <ComboboxList>
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <ComboboxOption key={place_id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
      </Box>
      <Box
        sx={{
          marginLeft: "15px",
          width: "100%",
          display: "flex",
        }}
      >
        <StyledTextField
          sx={{ width: "100%" }}
          placeholder="Display name (will use full location name if not set)"
          onChange={(e) => props.setLocationDisplayName(e.target.value)}
          value={props.locationDisplayName}
        />
      </Box>
    </Stack>
  );
};

export default PlacesAutocomplete;
