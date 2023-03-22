import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  eventActivityCardStyle,
  editButtonStyle,
  submitButtonTheme,
} from "../ui_styles/MuiStyles";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import CardContent from "@mui/joy/CardContent";
import CardCover from "@mui/joy/CardCover";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/material/Typography";
// import Box from "@mui/joy/Box";
import { Box, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../css/components.css";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EventPageActivityLocation from "./EventPageActivityLocation";
import { RichTextDisplay } from "./RichTextEditor";

const EventPageActivityCard = (activity) => {
  let activityDetails = activity["activity"];
  const [expand, setExpand] = useState(false);
  const [expandText, setExpandText] = useState("Details");

  const expandDetails = () => {
    setExpand(!expand);
  };

  const DisplayDates = () => {
    if (activityDetails.start_date === activityDetails.end_date) {
      return (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
            <Stack direction="row" spacing={1} marginRight={1}>
              <Typography variant="h7" color="white">
                {activityDetails.start_date_day}{" "}
                {activityDetails.start_date.split("/")[0]}{" "}
                {activityDetails.start_date_month}
              </Typography>
              <Typography variant="h7" color="#DAA520">
                {activityDetails.start_time}
              </Typography>
              <Typography
                color="#DAA520"
                variant="h7"
                display={
                  activityDetails.end_time !== undefined &&
                  activityDetails.end_time !== ""
                    ? ""
                    : "none"
                }
              >
                -
              </Typography>
              <Typography variant="h7" color="#DAA520">
                {activityDetails.end_time}
              </Typography>
            </Stack>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
            <Stack direction="row" spacing={1} marginRight={1}>
              <Typography variant="h7" color="white">
                {activityDetails.start_date_day}{" "}
                {activityDetails.start_date.split("/")[0]}{" "}
                {activityDetails.start_date_month}
              </Typography>
              <Typography variant="h7" color="#DAA520">
                {activityDetails.start_time}
              </Typography>
            </Stack>
            <Typography
              variant="h7"
              color="#DAA520"
              display={
                (activityDetails.end_time !== undefined &&
                  activityDetails.end_time !== "") ||
                (activityDetails.end_date !== undefined &&
                  activityDetails.end_date !== "")
                  ? ""
                  : "none"
              }
            >
              -
            </Typography>
            <Stack direction="row" spacing={1} marginLeft={1}>
              <Typography variant="h7" color="#DAA520">
                {activityDetails.end_time}
              </Typography>
              <Typography variant="h7" color="white">
                {activityDetails.end_date_day}{" "}
                {activityDetails.end_date.split("/")[0]}{" "}
                {activityDetails.end_date_month}
              </Typography>
            </Stack>
          </Box>
        </>
      );
    }
  };

  return (
    <>
      <Card sx={eventActivityCardStyle}>
        <Box className="event-page-activity-card-title">
          <Typography variant="h5"> {activityDetails.title} </Typography>
        </Box>
        <Box>
          <DisplayDates />
        </Box>
        <Box>
          {/* <Typography> {activityDetails.location_display_name}</Typography>
           */}

          <EventPageActivityLocation
            locationType={activityDetails.location_type}
            locationDisplayName={activityDetails.location_display_name}
            locationString={activityDetails.location_string}
            meetLink={activityDetails.meet_link}
            marker={activityDetails.marker}
          />
        </Box>

        <Box display={expand === true ? "" : "none"}>
          <RichTextDisplay description={activityDetails.description} />
        </Box>

        <Box className="event-page-activity-card-expand">
          <ThemeProvider theme={submitButtonTheme}>
            <Button
              size="small"
              startIcon={
                expand === false ? <ExpandMoreIcon /> : <ExpandLessIcon />
              }
              onClick={expandDetails}
            >
              Details
            </Button>
          </ThemeProvider>
        </Box>
      </Card>
    </>
  );
};

export default EventPageActivityCard;
