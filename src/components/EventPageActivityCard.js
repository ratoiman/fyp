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
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../css/components.css";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const EventPageActivityCard = (activity) => {
  let activityDetails = activity["activity"];
  const [expand, setExpand] = useState(false);
  const [expandText, setExpandText] = useState("Details");

  const expandDetails = () => {
    setExpand(!expand);
  };

  return (
    <>
      <Card variant="outlined">
        <Box className="event-page-activity-card-title">
          <Typography variant="h5"> {activityDetails.title} </Typography>
        </Box>
        <Box>
          <Typography variant="h7" className="event-page-activity-card-title">
            {" "}
            {activityDetails.start_date_day}{" "}
            {activityDetails.start_date.split("/")[0]}{" "}
            {activityDetails.start_date_month} {activityDetails.start_time} -{" "}
            {activityDetails.end_time}
          </Typography>
        </Box>

        <Box display={expand === true ? "" : "none"}>
          <Box>
            <Typography variant="h7">{activityDetails.description}</Typography>
          </Box>
          {/* <Box>
            <Typography variant="h7">{activityDetails.description}</Typography>
          </Box>
          <Box>
            <Typography variant="h7">{activityDetails.description}</Typography>
          </Box>
          <Box>
            <Typography variant="h7">{activityDetails.description}</Typography>
          </Box>
          <Box>
            <Typography variant="h7">{activityDetails.description}</Typography>
          </Box>
          <Box>
            <Typography variant="h7">{activityDetails.description}</Typography>
          </Box> */}
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
