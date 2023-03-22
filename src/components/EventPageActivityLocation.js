import {
  Box,
  Button,
  Link,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import {
  event_location_stack_mobile_style,
  event_location_stack_style,
  submitButtonTheme,
} from "../ui_styles/MuiStyles";
import GoogleMapsIntegration from "./GoogleMapsIntegration";
import { isMobile } from "react-device-detect";

const EventPageActivityLocation = (props) => {
  const [displayMap, setDisplayMap] = useState(false);

  const OnlineEvent = () => {
    return (
      <Box sx={isMobile ? { marginLeft: 0 } : { marginLeft: 3 }}>
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
                sx={{ marginTop: 0.25, marginRight: 1, fontSize: "18px" }}
              />
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontSize: "15px" }}
              >
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

    return (
      <Box>
        <Stack
          direction="row"
          sx={
            isMobile
              ? event_location_stack_mobile_style
              : event_location_stack_style
          }
        >
          <ThemeProvider theme={submitButtonTheme}>
            <LocationOnOutlinedIcon
              color="primary"
              sx={{ marginTop: 0.5, marginRight: 1, fontSize: "18px" }}
            />
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontSize: "15px", marginTop: 0.25 }}
            >
              {props.locationDisplayName === ""
                ? props.locationString
                : props.locationDisplayName}
            </Typography>
            <Box sx={{ marginLeft: 1 }}>
              <Button
                disableRipple
                endIcon={displayMap ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                variant="text"
                color="primary"
                onClick={() => setDisplayMap(!displayMap)}
                sx={{ fontSize: "10px", width: "100px" }}
              >
                {displayMap ? "hide map" : "view map"}
              </Button>
            </Box>
          </ThemeProvider>
        </Stack>
        <Box
          className={
            isMobile
              ? "map-container-event-page-mobile"
              : "map-container-event-page"
          }
          display={displayMap ? "" : "none"}
        >
          <iframe
            src={locationToLink(props.locationString)}
            width="100%"
            height="100%"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </Box>
      </Box>
    );
  };

  const InPersonNoMap = () => {
    return (
      <Box>
        <Stack
          direction="row"
          sx={
            isMobile
              ? { marginLeft: 0, marginTop: 1.5 }
              : { marginLeft: 3, marginTop: 1.5 }
          }
        >
          <ThemeProvider theme={submitButtonTheme}>
            <LocationOnOutlinedIcon
              color="primary"
              sx={{ marginTop: 0.25, marginRight: 1, fontSize: "18px" }}
            />
            <Typography variant="h6" color="primary" sx={{ fontSize: "15px" }}>
              In Person Activity
            </Typography>
          </ThemeProvider>
        </Stack>
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
        ) : props.locationType === "In person" &&
          props.locationString === "" ? (
          <>
            <InPersonNoMap />
          </>
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

export default EventPageActivityLocation;
