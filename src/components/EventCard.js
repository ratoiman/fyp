import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import CardContent from "@mui/joy/CardContent";
import Link from "@mui/joy/Link";
import EventPage from "../pages/EventPage";
import texture from "../resources/texture.jpeg";

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
            sx={{
              minWidth: 400,
              maxWidth: 400,
              borderColor: "#DAA520",
              gap: 2,
              "&:hover": {
                boxShadow: "md",
                borderColor: "#DAA520",
                borderBlock: "2px solid",
                borderBlockColor: "#DAA520",
                textColor: "#DAA520",
              },
              my: "20px",
            }}
          >
            <CardCover>
              <img
                // src="https://c4.wallpaperflare.com/wallpaper/955/69/70/minimalism-space-stars-wallpaper-preview.jpg"
                // srcSet="https://images.unsplash.com/photo-1542773998-9325f0a098d7?auto=format&fit=crop&w=320&dpr=2 2x"
                src={texture}
                loading="lazy"
                alt=""
              />
            </CardCover>
            <CardContent>
              <Typography
                level="h2"
                fontSize="lg"
                // textColor="#DAA520"
                mb={1}
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
