import React, { useEffect, useState } from "react";
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
import { isMobile } from "react-device-detect";
import { ThemeProvider } from "@mui/material/styles";
import {
  submitButtonTheme,
  new_event_menu_item_style,
} from "../ui_styles/MuiStyles";
import Button from "@mui/material/Button";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import "@reach/combobox/styles.css";

// todo:: uncommented ready in ComboboxInput as it was disabling the component without enabling it, might cause some problems

const PlacesAutocomplete = (props) => {
  const [locationTypeAnchor, setLocationTypeAnchor] = useState(null);
  const [locationTypeOpen, setLocationTypeOpen] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_API_KEY_MAPS,
    libraries: ["places"],
  });

  let {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  //  const [loading] = useGoogleMapsApi({ library: "places" });

  const handleLocationTypeClick = (event) => {
    setLocationTypeAnchor(event.currentTarget);
    setLocationTypeOpen(!locationTypeOpen);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    props.setLocationString(address);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    props.setMarker({ lat, lng });
  };

  const handleClose = (setAnchor, setOpen) => {
    setAnchor(null);
    setOpen(false);
  };

  console.log("data ", data);
  console.log("status ", status);
  console.log("ready ", ready);
  // console.log("value ", value);

  if (isLoaded) {
    if (!isMobile) {
      if (props.locationType === "Online") {
        return (
          <>
            <Stack direction="row" sx={{ display: "flex", width: "100%" }}>
              {/* Location type */}
              <Box>
                <ThemeProvider theme={submitButtonTheme}>
                  <Button
                    aria-controls={locationTypeOpen ? "group-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={locationTypeOpen ? "true" : undefined}
                    variant="text"
                    color="primary"
                    onClick={handleLocationTypeClick}
                    endIcon={<ArrowDropDown />}
                    startIcon={
                      props.locationType === "Online" ? (
                        <VideoCameraFrontOutlinedIcon sx={{ width: "20px" }} />
                      ) : (
                        <LocationOnOutlinedIcon sx={{ width: "20px" }} />
                      )
                    }
                    sx={
                      isMobile
                        ? {
                            width: "60px",
                            height: "30px",
                            fontWeight: "500",
                            letterSpacing: "1.5px",
                          }
                        : {
                            width: "190px",
                            height: "56px",
                            fontWeight: "500",
                            letterSpacing: "1.5px",
                          }
                    }
                  >
                    {props.locationType}
                  </Button>
                </ThemeProvider>
                <Menu
                  id="group-menu"
                  anchorEl={locationTypeAnchor}
                  open={locationTypeOpen}
                  onClose={() =>
                    handleClose(setLocationTypeAnchor, setLocationTypeOpen)
                  }
                  aria-labelledby="group-demo-button"
                  sx={{
                    minWidth: "120px",
                    // minHeight: "150px",
                    fontWeight: "600",
                    "--List-decorator-size": "24px",
                    borderStyle: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "25px",
                      bgcolor: "#daa520",
                      zIndex: "2",
                      minHeight: "80px",
                    }}
                  >
                    <Stack direction="column">
                      <Box className="menu-item">
                        <MenuItem
                          sx={new_event_menu_item_style}
                          onClick={() => {
                            props.setLocationType("in person");
                            handleClose(
                              setLocationTypeAnchor,
                              setLocationTypeOpen
                            );
                          }}
                        >
                          <Stack direction="row" spacing={0}>
                            <Box sx={{ transform: "translateY(2px)" }}>
                              <ListItemDecorator>
                                <LocationOnOutlinedIcon fontSize="xs" />
                              </ListItemDecorator>
                            </Box>
                            <Box>In Person</Box>
                          </Stack>
                        </MenuItem>
                      </Box>

                      <Box className="menu-item">
                        <MenuItem
                          sx={new_event_menu_item_style}
                          endIcon={<VideoCameraFrontOutlinedIcon />}
                          onClick={() => {
                            props.setLocationType("Online");
                            handleClose(
                              setLocationTypeAnchor,
                              setLocationTypeOpen
                            );
                          }}
                        >
                          <Stack direction="row" spacing={0}>
                            <Box sx={{ transform: "translateY(2px)" }}>
                              <ListItemDecorator>
                                <VideoCameraFrontOutlinedIcon fontSize="xs" />
                              </ListItemDecorator>
                            </Box>
                            <Box>Online</Box>
                          </Stack>
                        </MenuItem>
                      </Box>
                    </Stack>
                  </Box>
                  <ListDivider />
                </Menu>
              </Box>

              <Box sx={{ width: "100%" }}>
                <StyledTextField
                  placeholder="Meeting link"
                  sx={{ width: "100%" }}
                  value={props.meetLink}
                  onChange={(e) => props.setMeetLink(e.target.value)}
                />
              </Box>
            </Stack>
          </>
        );
      } else {
        return (
          <Stack direction="row" sx={{ display: "flex", width: "100%" }}>
            <Box>
              <ThemeProvider theme={submitButtonTheme}>
                <Button
                  aria-controls={locationTypeOpen ? "group-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={locationTypeOpen ? "true" : undefined}
                  variant="text"
                  color="primary"
                  onClick={handleLocationTypeClick}
                  endIcon={<ArrowDropDown />}
                  startIcon={
                    props.locationType === "Online" ? (
                      <VideoCameraFrontOutlinedIcon sx={{ width: "20px" }} />
                    ) : (
                      <LocationOnOutlinedIcon sx={{ width: "20px" }} />
                    )
                  }
                  sx={
                    isMobile
                      ? {
                          width: "60px",
                          height: "30px",
                          fontWeight: "500",
                          letterSpacing: "1.5px",
                        }
                      : {
                          width: "190px",
                          height: "56px",
                          fontWeight: "500",
                          letterSpacing: "1.5px",
                        }
                  }
                >
                  {props.locationType}
                </Button>
              </ThemeProvider>
              <Menu
                id="group-menu"
                anchorEl={locationTypeAnchor}
                open={locationTypeOpen}
                onClose={() =>
                  handleClose(setLocationTypeAnchor, setLocationTypeOpen)
                }
                aria-labelledby="group-demo-button"
                sx={{
                  minWidth: "120px",
                  // minHeight: "150px",
                  fontWeight: "600",
                  "--List-decorator-size": "24px",
                  borderStyle: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "25px",
                    bgcolor: "#daa520",
                    zIndex: "2",
                    minHeight: "80px",
                  }}
                >
                  <Stack direction="column">
                    <Box className="menu-item">
                      <MenuItem
                        sx={new_event_menu_item_style}
                        onClick={() => {
                          props.setLocationType("in person");
                          handleClose(
                            setLocationTypeAnchor,
                            setLocationTypeOpen
                          );
                        }}
                      >
                        <Stack direction="row" spacing={0}>
                          <Box sx={{ transform: "translateY(2px)" }}>
                            <ListItemDecorator>
                              <LocationOnOutlinedIcon fontSize="xs" />
                            </ListItemDecorator>
                          </Box>
                          <Box>In Person</Box>
                        </Stack>
                      </MenuItem>
                    </Box>

                    <Box className="menu-item">
                      <MenuItem
                        sx={new_event_menu_item_style}
                        endIcon={<VideoCameraFrontOutlinedIcon />}
                        onClick={() => {
                          props.setLocationType("Online");
                          handleClose(
                            setLocationTypeAnchor,
                            setLocationTypeOpen
                          );
                        }}
                      >
                        <Stack direction="row" spacing={0}>
                          <Box sx={{ transform: "translateY(2px)" }}>
                            <ListItemDecorator>
                              <VideoCameraFrontOutlinedIcon fontSize="xs" />
                            </ListItemDecorator>
                          </Box>
                          <Box>Online</Box>
                        </Stack>
                      </MenuItem>
                    </Box>
                  </Stack>
                </Box>
                <ListDivider />
              </Menu>
            </Box>
            <Box className="combobox-container">
              <Combobox onSelect={handleSelect} className="combobox">
                {" "}
                <ComboboxInput
                  className="combobox-input"
                  value={props.locationString}
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
      }
    } else {
      if (props.locationType === "Online") {
        return (
          <>
            <Stack direction="row">
              {/* Location type */}
              <Box>
                <ThemeProvider theme={submitButtonTheme}>
                  <Button
                    aria-controls={locationTypeOpen ? "group-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={locationTypeOpen ? "true" : undefined}
                    variant="text"
                    color="primary"
                    onClick={handleLocationTypeClick}
                    endIcon={<ArrowDropDown />}
                    startIcon={
                      props.locationType === "Online" ? (
                        <VideoCameraFrontOutlinedIcon sx={{ width: "20px" }} />
                      ) : (
                        <LocationOnOutlinedIcon sx={{ width: "20px" }} />
                      )
                    }
                    sx={
                      isMobile
                        ? {
                            width: "60px",
                            height: "30px",
                            fontWeight: "500",
                            letterSpacing: "1.5px",
                          }
                        : {
                            width: "190px",
                            height: "56px",
                            fontWeight: "500",
                            letterSpacing: "1.5px",
                          }
                    }
                  >
                    {/* {locationType} */}
                  </Button>
                </ThemeProvider>
                <Menu
                  id="group-menu"
                  anchorEl={locationTypeAnchor}
                  open={locationTypeOpen}
                  onClose={() =>
                    handleClose(setLocationTypeAnchor, setLocationTypeOpen)
                  }
                  aria-labelledby="group-demo-button"
                  sx={{
                    minWidth: "120px",
                    // minHeight: "150px",
                    fontWeight: "600",
                    "--List-decorator-size": "24px",
                    borderStyle: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "25px",
                      bgcolor: "#daa520",
                      zIndex: "2",
                      minHeight: "80px",
                    }}
                  >
                    <Stack direction="column">
                      <Box className="menu-item">
                        <MenuItem
                          sx={new_event_menu_item_style}
                          onClick={() => {
                            props.setLocationType("in person");
                            handleClose(
                              setLocationTypeAnchor,
                              setLocationTypeOpen
                            );
                          }}
                        >
                          <Stack direction="row" spacing={0}>
                            <Box sx={{ transform: "translateY(2px)" }}>
                              <ListItemDecorator>
                                <LocationOnOutlinedIcon fontSize="xs" />
                              </ListItemDecorator>
                            </Box>
                            <Box>In Person</Box>
                          </Stack>
                        </MenuItem>
                      </Box>

                      <Box className="menu-item">
                        <MenuItem
                          sx={new_event_menu_item_style}
                          endIcon={<VideoCameraFrontOutlinedIcon />}
                          onClick={() => {
                            props.setLocationType("Online");
                            handleClose(
                              setLocationTypeAnchor,
                              setLocationTypeOpen
                            );
                          }}
                        >
                          <Stack direction="row" spacing={0}>
                            <Box sx={{ transform: "translateY(2px)" }}>
                              <ListItemDecorator>
                                <VideoCameraFrontOutlinedIcon fontSize="xs" />
                              </ListItemDecorator>
                            </Box>
                            <Box>Online</Box>
                          </Stack>
                        </MenuItem>
                      </Box>
                    </Stack>
                  </Box>
                  <ListDivider />
                </Menu>
              </Box>

              <Box>
                <StyledTextField
                  placeholder="Meeting link"
                  sx={{ width: "100%" }}
                  value={props.meetLink}
                  onChange={(e) => props.setMeetLink(e.target.value)}
                ></StyledTextField>
              </Box>
            </Stack>
          </>
        );
      } else {
        return (
          <>
            <Stack direction="column" sx={{ display: "flex", width: "100%" }}>
              <Stack direction="row" sx={{ display: "flex", width: "100%" }}>
                <Box>
                  <ThemeProvider theme={submitButtonTheme}>
                    <Button
                      aria-controls={
                        locationTypeOpen ? "group-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={locationTypeOpen ? "true" : undefined}
                      variant="text"
                      color="primary"
                      onClick={handleLocationTypeClick}
                      endIcon={<ArrowDropDown />}
                      startIcon={
                        props.locationType === "Online" ? (
                          <VideoCameraFrontOutlinedIcon
                            sx={{ width: "20px" }}
                          />
                        ) : (
                          <LocationOnOutlinedIcon sx={{ width: "20px" }} />
                        )
                      }
                      sx={
                        isMobile
                          ? {
                              width: "60px",
                              height: "30px",
                              fontWeight: "500",
                              letterSpacing: "1.5px",
                            }
                          : {
                              width: "190px",
                              height: "56px",
                              fontWeight: "500",
                              letterSpacing: "1.5px",
                            }
                      }
                    >
                      {/* {locationType} */}
                    </Button>
                  </ThemeProvider>
                  <Menu
                    id="group-menu"
                    anchorEl={locationTypeAnchor}
                    open={locationTypeOpen}
                    onClose={() =>
                      handleClose(setLocationTypeAnchor, setLocationTypeOpen)
                    }
                    aria-labelledby="group-demo-button"
                    sx={{
                      minWidth: "120px",
                      // minHeight: "150px",
                      fontWeight: "600",
                      "--List-decorator-size": "24px",
                      borderStyle: "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "25px",
                        bgcolor: "#daa520",
                        zIndex: "2",
                        minHeight: "80px",
                      }}
                    >
                      <Stack direction="column">
                        <Box className="menu-item">
                          <MenuItem
                            sx={new_event_menu_item_style}
                            onClick={() => {
                              props.setLocationType("in person");
                              handleClose(
                                setLocationTypeAnchor,
                                setLocationTypeOpen
                              );
                            }}
                          >
                            <Stack direction="row" spacing={0}>
                              <Box sx={{ transform: "translateY(2px)" }}>
                                <ListItemDecorator>
                                  <LocationOnOutlinedIcon fontSize="xs" />
                                </ListItemDecorator>
                              </Box>
                              <Box>In Person</Box>
                            </Stack>
                          </MenuItem>
                        </Box>

                        <Box className="menu-item">
                          <MenuItem
                            sx={new_event_menu_item_style}
                            endIcon={<VideoCameraFrontOutlinedIcon />}
                            onClick={() => {
                              props.setLocationType("Online");
                              handleClose(
                                setLocationTypeAnchor,
                                setLocationTypeOpen
                              );
                            }}
                          >
                            <Stack direction="row" spacing={0}>
                              <Box sx={{ transform: "translateY(2px)" }}>
                                <ListItemDecorator>
                                  <VideoCameraFrontOutlinedIcon fontSize="xs" />
                                </ListItemDecorator>
                              </Box>
                              <Box>Online</Box>
                            </Stack>
                          </MenuItem>
                        </Box>
                      </Stack>
                    </Box>
                    <ListDivider />
                  </Menu>
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
                    onChange={(e) =>
                      props.setLocationDisplayName(e.target.value)
                    }
                    value={props.locationDisplayName}
                  />
                </Box>
              </Stack>
              <Box className="combobox-container">
                <Combobox onSelect={handleSelect} className="combobox">
                  {" "}
                  <ComboboxInput
                    className="combobox-input"
                    value={props.locationString}
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
            </Stack>
          </>
        );
      }
    }
  } else {
    <Loading />;
  }
};

export default PlacesAutocomplete;
