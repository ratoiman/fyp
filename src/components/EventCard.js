import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardOverflow from "@mui/joy/CardOverflow";
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
  submitButtonTheme,
} from "../ui_styles/MuiStyles";
import { isMobile } from "react-device-detect";
import { Divider } from "@mui/joy";
import { Box, Stack } from "@mui/material";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { ThemeProvider } from "@mui/material/styles";

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
        <Container
          className={
            isMobile === true ? "event-card-mobile" : "event-page-card"
          }
        >
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={isMobile ? event_card_style_mobile : event_card_style_desktop}
          >
            {/* <CardCover>
              <img src={texture} loading="lazy" alt="" />
            </CardCover> */}

            <CardContent
              sx={{
                minWidth: "100%",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "black",
              }}
            >
              <Link
                overlay
                onClick={() => {
                  props.handleEventLink(props.eventID);
                }}
                underline="none"
                // href="#interactive-card"
                sx={{ color: "text.tertiary" }}
              ></Link>
              <Typography
                textAlign="center"
                variant="h4"
                fontSize="lg"
                fontWeight={"bold"}
              >
                {props.title}
              </Typography>
              <Typography>{props.subtitle}</Typography>
              <Typography
                variant="h6"
                fontSize="md"
                mt={1}
                marginLeft={4}
                marginRight={2}
              >
                {props.description}
              </Typography>

              <Typography variant="h7" mt={2}>
                created by {props.author}
              </Typography>

              {/* <Typography fontSize="sm" aria-describedby="card-description" mb={1}> */}
            </CardContent>
            <Box
              sx={{
                zIndex: 2,
                // marginRight: "50px", // paddingLeft: "80%",
                // paddingRight: "5%",
                maxHeight: "40px",
                // minWidth: "15%",
                display: "flex",
                transform: "translateY(-125%) translateX(-120%)",
                // transform: "translateX(-100%)",
                // transform: "",
                alignContent: "center",
                // backgroundColor: "white",
              }}
            >
              <CardContent
                sx={{
                  bgcolor: "rgb(24, 20, 19)",
                  borderStyle: "solid",
                  borderColor: "#DAA520",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "25%",
                  minWidth: "130px",
                }}
              >
                <Divider inset="context">
                 
                </Divider>
              </CardContent>
            </Box>
          </Card>
        </Container>
      </>
    );
  } else {
    return <EventPage />;
  }
};

export default EventCard;
