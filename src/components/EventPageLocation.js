import { Box, Link, Stack, ThemeProvider, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { submitButtonTheme } from "../ui_styles/MuiStyles";
import GoogleMapsIntegration from "./GoogleMapsIntegration";
import { isMobile } from "react-device-detect";

const EventPageLocation = (props) => {
  const [displayMap, setDisplayMap] = useState(false);

  const OnlineEvent = () => {
    return (
      <Box>
        <Link
          target="_blank"
          href={props.meetLink}
          rel="noreffer"
          underline="none"

          //   to="meet.google.com/zuj-knvr-pye"
        >
          <Stack direction="row" sx={{ marginTop: 1.5 }}>
            <ThemeProvider theme={submitButtonTheme}>
              <VideoCameraFrontOutlinedIcon
                color="primary"
                sx={{ marginTop: 0.5, marginRight: 1 }}
              />
              <Typography variant="h6" color="primary">
                Online Event (click for meeting link)
              </Typography>
            </ThemeProvider>
          </Stack>
        </Link>
      </Box>
    );
  };

  const InPersonWithLocation = () => {
    const locationToLink = (location) => {
      let locationString = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_PUBLIC_API_KEY_MAPS}&q=`;
      const locationArray = location.split(",");
      locationArray.map((loc) => {
        locationString += loc.replaceAll(" ", "+") + ",";
      });

      return locationString;
    };

    // console.log("marker", props.locationString.split(",")[0].replaceAll(" ", "+"));
    console.log(
      "string",
      locationToLink(props.locationString),
      process.env.REACT_APP_PUBLIC_API_KEY_MAPS
    );
    return (
      <Box>
        <Stack
          direction="row"
          sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}
        >
          <ThemeProvider theme={submitButtonTheme}>
            <LocationOnOutlinedIcon
              color="primary"
              sx={{ marginTop: 0.5, marginRight: 1 }}
            />
            <Typography variant="h6" color="primary">
              {props.locationDisplayName === ""
                ? props.locationString
                : props.locationDisplayName}
            </Typography>
          </ThemeProvider>
        </Stack>
        <Box className={isMobile ? "map-container-event-page-mobile" : "map-container-event-page"}>
          <iframe
            src={locationToLink(props.locationString)}
            width="100%"
            height="100%"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </Box>
        {/* <GoogleMapsIntegration marker={props.marker} /> */}
      </Box>
    );
  };

  return (
    <>
      <Box>
        {props.locationType === "Online" ? (
          <>
            <OnlineEvent />
          </>
        ) : props.locationType === "in person" &&
          props.locationString === "" ? (
          <>No map</>
        ) : (
          <>
            <InPersonWithLocation />
          </>
        )}
        <Typography variant="h4"></Typography>
      </Box>
    </>
  );
};

export default EventPageLocation;
