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
import {
  StyledTextField,
  submitButtonTheme,
  deleteLocationStyle,
  deleteLocationStyle2,
} from "../ui_styles/MuiStyles";
import { useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";
import { isMobile } from "react-device-detect";

// todo:: uncommented ready in ComboboxInput as it was disabling the component without enabling it, might cause some problems

const PlacesAutocomplete = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_API_KEY_MAPS,
    libraries: ["places"],
  });

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    props.setLocationString(address);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    props.setMarker({ lat, lng });
  };

  const deleteInputField = (fieldSetter) => {
    fieldSetter("");
  };

  if (isLoaded) {
    if (isMobile) {
      return (
        <Stack direction="column" sx={{ display: "flex", width: "100%" }}>
          <Box className="combobox-container">
            <Combobox onSelect={handleSelect} className="combobox">
              {" "}
              <Box className="combobox-input-container">
                <Stack
                  direction="row"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <ThemeProvider theme={submitButtonTheme}>
                    <Box
                      sx={deleteLocationStyle}
                      display={
                        props.locationString.length === 0 ? "none" : "flex"
                      }
                    >
                      <IconButton
                        onClick={() => {
                          deleteInputField(props.setLocationString);
                          deleteInputField(props.setMarker);
                        }}
                      >
                        <DeleteOutlineOutlinedIcon
                          sx={{
                            width: "100%",
                          }}
                          color="secondary"
                        />
                      </IconButton>
                    </Box>
                  </ThemeProvider>{" "}
                  <ComboboxInput
                    className="combobox-input"
                    value={props.locationString}
                    onChange={(e) => {
                      setValue(e.target.value);
                      props.setLocationString(e.target.value);
                    }}
                    placeholder="Location"
                  ></ComboboxInput>
                </Stack>
              </Box>
              <ComboboxPopover
                portal={false}
                style={{ backgroundColor: "#212529", color: "white" }}
              >
                <ComboboxList>
                  {status === "OK" &&
                    data.map(({ place_id, description }) => (
                      <ComboboxOption
                        className="combobox-option"
                        key={place_id}
                        value={description}
                      />
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
            <Stack
              direction="row"
              sx={{
                width: "100%",
                display: "flex",
              }}
            >
              <ThemeProvider theme={submitButtonTheme}>
                <Box
                  sx={deleteLocationStyle2}
                  display={
                    props.locationDisplayName.length === 0 ? "none" : "flex"
                  }
                >
                  <IconButton
                    onClick={() => {
                      deleteInputField(props.setLocationDisplayName);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon
                      sx={{
                        width: "100%",
                      }}
                      color="secondary"
                    />
                  </IconButton>
                </Box>
              </ThemeProvider>{" "}
              <StyledTextField
                sx={{ width: "100%" }}
                placeholder="Display name (will use full location name if not set)"
                onChange={(e) => props.setLocationDisplayName(e.target.value)}
                value={props.locationDisplayName}
              />
            </Stack>
          </Box>
        </Stack>
      );
    } else {
      return (
        <Stack direction="row" sx={{ display: "flex", width: "100%" }}>
          <Box className="combobox-container">
            <Combobox onSelect={handleSelect} className="combobox">
              {" "}
              <Box className="combobox-input-container">
                <Stack
                  direction="row"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <ThemeProvider theme={submitButtonTheme}>
                    <Box
                      sx={deleteLocationStyle}
                      display={
                        props.locationString.length === 0 ? "none" : "flex"
                      }
                    >
                      <IconButton
                        onClick={() => {
                          deleteInputField(props.setLocationString);
                          deleteInputField(props.setMarker);
                        }}
                      >
                        <DeleteOutlineOutlinedIcon
                          sx={{
                            width: "100%",
                          }}
                          color="secondary"
                        />
                      </IconButton>
                    </Box>
                  </ThemeProvider>{" "}
                  <ComboboxInput
                    className="combobox-input"
                    value={props.locationString}
                    onChange={(e) => {
                      setValue(e.target.value);
                      props.setLocationString(e.target.value);
                    }}
                    placeholder="Location"
                  ></ComboboxInput>
                </Stack>
              </Box>
              <ComboboxPopover
                portal={false}
                style={{ backgroundColor: "#212529", color: "white" }}
              >
                <ComboboxList>
                  {status === "OK" &&
                    data.map(({ place_id, description }) => (
                      <ComboboxOption
                        className="combobox-option"
                        key={place_id}
                        value={description}
                      />
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
            <Stack
              direction="row"
              sx={{
                width: "100%",
                display: "flex",
              }}
            >
              <ThemeProvider theme={submitButtonTheme}>
                <Box
                  sx={deleteLocationStyle2}
                  display={
                    props.locationDisplayName.length === 0 ? "none" : "flex"
                  }
                >
                  <IconButton
                    onClick={() => {
                      deleteInputField(props.setLocationDisplayName);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon
                      sx={{
                        width: "100%",
                      }}
                      color="secondary"
                    />
                  </IconButton>
                </Box>
              </ThemeProvider>{" "}
              <StyledTextField
                sx={{ width: "100%" }}
                placeholder="Display name (will use full location name if not set)"
                onChange={(e) => props.setLocationDisplayName(e.target.value)}
                value={props.locationDisplayName}
              />
            </Stack>
          </Box>
        </Stack>
      );
    }
  } else {
    <Loading />;
  }
};

export default PlacesAutocomplete;
