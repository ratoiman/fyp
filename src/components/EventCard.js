import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/material/Typography";
import Chip from "@mui/joy/Chip";
import CardContent from "@mui/joy/CardContent";
import Link from "@mui/joy/Link";
import EventPage from "../pages/EventPage";
import texture from "../resources/texture.jpeg";
import background from "../resources/solid-concrete-wall-textured-backdrop.jpg";
import {
  event_card_style_desktop,
  event_card_style_mobile,
} from "../ui_styles/MuiStyles";
import { isMobile } from "react-device-detect";

const EventCard = (props) => {
  const [viewStartTime, setViewStartTime] = useState("d-none");
  const [viewEndDate, setViewEndDate] = useState("d-none");
  const [viewEndTime, setViewEndTime] = useState("d-none");
  const [eventPageLoad, setEventPageLoad] = useState(false);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const navigator = useNavigate();
  const setVisible = (view, setter) => {
    if (view) {
      setter("");
    }
  };

  const handleEventLink = (id) => {
    // navigator("/event")
    setSelectedEventID(id);
    setEventPageLoad(true);
  };

  useState(() => {
    setVisible(props.start_time, setViewStartTime);
  }, [props.start_time]);

  useState(() => {
    setVisible(props.end_date, setViewEndDate);
  }, [props.end_date]);
  useState(() => {
    setVisible(props.end_time, setViewEndTime);
  }, [props.end_time]);

  if (eventPageLoad === false) {
    return (
      <>
        <Container className="event-card">
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={isMobile ? event_card_style_mobile : event_card_style_desktop}
          >
            <CardCover>
              <img src={texture} loading="lazy" alt="" />
            </CardCover>
            <CardContent>
              <Typography
                textAlign="center"
                variant="h4"
                fontSize="lg"
                fontWeight={"bold"}
              >
                {props.title}
              </Typography>

              <Typography textColor="neutral.300">{props.subtitle}</Typography>

              <Typography level="h4" fontSize="md" mt={1}>
                {props.description}
              </Typography>

              {/* <Typography fontSize="sm" aria-describedby="card-description" mb={1}> */}
              <Link
                overlay
                onClick={() => {
                  props.handleEventLink(props.eventID);
                }}
                underline="none"
                href="#interactive-card"
                sx={{ color: "text.tertiary" }}
              >
                {/* See event... */}
              </Link>
              {/* </Typography> */}
            </CardContent>
          </Card>
        </Container>
      </>
    );
  } else {
    return <EventPage></EventPage>;
  }
};

export default EventCard;

// https://c4.wallpaperflare.com/wallpaper/955/69/70/minimalism-space-stars-wallpaper-preview.jpg
