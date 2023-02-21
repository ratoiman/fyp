import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/joy/Link";
import EventPage from "../pages/EventPage";
import texture from "../resources/texture.jpeg";
import background from "../resources/solid-concrete-wall-textured-backdrop.jpg";
import {
  event_card_style_desktop,
  event_card_style_mobile,
  submitButtonTheme,
  follow_button,
  following_button,
  popupStyle,
} from "../ui_styles/MuiStyles";
import { isMobile } from "react-device-detect";
import { Divider } from "@mui/joy";
import { Box, Modal, Stack } from "@mui/material";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ThemeProvider } from "@mui/material/styles";
import { BorderColor } from "@mui/icons-material";
import { useUserAuth } from "../context/UserAuthContext";
import { handleFollow, handleUnfollow } from "../context/DbCallsContext";
import { db } from "../utils/firebase";
import { onSnapshot } from "firebase/firestore";
import { collection } from "firebase/firestore";
import ConfirmAction from "./ConfirmAction";

const EventCard2 = (props) => {
  const [viewStartTime, setViewStartTime] = useState("d-none");
  const [viewEndDate, setViewEndDate] = useState("d-none");
  const [viewEndTime, setViewEndTime] = useState("d-none");
  const [userEvents, setUserEvents] = useState(new Set());
  const [eventPageLoad, setEventPageLoad] = useState(false);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [isFollowing, setIsFollowing] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unfollowPopup, setUnfollowPopup] = useState(false);
  const [snapshot, setSnapshot] = useState([]);
  const { user } = useUserAuth();
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

  const getUserEvents = () => {
    try {
      if (user !== null) {
        if (Object.keys(user).length !== 0) {
          const usersRef = collection(db, "users", user.uid, "events");
          onSnapshot(usersRef, async (snap) => {
            setUserEvents(
              snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFollowStatus = () => {
    // console.log("user list ", props.usersList);
    let admin = false;

    let arr = Array.from(userEvents);
    let found = arr.find((ev) => ev["id"] === props.eventID);

    console.log("found ", found);

    if (found) {
      setIsFollowing(true);
      if (found.status === "admin") {
        setIsAdmin(true);
      }
    } else {
      setIsFollowing(false);
      setIsAdmin(false);
    }

    //   if (found) {
    //     setIsFollowing(true);
    //     if (admin) {
    //       setIsAdmin(true);
    //     }
    //   } else {
    //     setIsFollowing(false);
    //     setIsAdmin(false);
    //   }
    // });
  };

  const unfollow = () => {
    handleUnfollow(db, props.eventID, user.uid, setIsFollowing);
    
    // This is for MyEvents page to remove the unfollowed event from the displayed events
    if (props.followingOnly) {
      const objInd = props.userEventsDetails.findIndex(
        (obj) => obj.id === props.eventID
      );
      props.userEventsDetails.splice(objInd, 1);
    }
    setUnfollowPopup(false);
    console.log("Event ", props.eventID, " unfollowed");
  };

  const handleEdit = () => {
    // console.log("edit");
  };

  useEffect(() => {
    getUserEvents();
  }, [user]);

  useEffect(() => {
    getFollowStatus();
  }, [userEvents]);

  // console.log(props.title, " ", isAdmin);

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
            sx={isMobile ? event_card_style_mobile : event_card_style_desktop}
          >
            <CardMedia
              image={texture}
              sx={{
                maxHeight: "55px",
                minWidth: "100%",
                display: "flex",
              }}
            >
              <CardContent
                sx={{
                  minWidth: "100%",
                  display: "flex",
                  // justifyContent: "right",
                  // backgroundColor: "green",
                }}
              >
                {" "}
                <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h7"
                      sx={{ color: "rgb(173, 173, 173)", paddingRight: "20%" }}
                    >
                      created by {props.author}
                    </Typography>
                  </Box>
                  <Box>
                    <ThemeProvider theme={submitButtonTheme}>
                      {isFollowing ? (
                        <Button
                          onClick={() => {
                            if (isAdmin) {
                              handleEdit();
                            } else {
                              setUnfollowPopup(true);
                            }
                          }}
                          sx={following_button}
                          variant="contained"
                          startIcon={
                            isAdmin ? (
                              <EditOutlinedIcon />
                            ) : (
                              <FavoriteOutlinedIcon />
                            )
                          }
                        >
                          {isAdmin ? "Edit" : "following"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            handleFollow(
                              db,
                              props.eventID,
                              user.uid,
                              props.start_date,
                              props.start_time,
                              props.end_date,
                              props.end_time,
                              setIsFollowing
                            );
                            getFollowStatus();
                          }}
                          sx={follow_button}
                          variant="outlined"
                          startIcon={<FavoriteBorderOutlinedIcon />}
                        >
                          follow
                        </Button>
                      )}
                    </ThemeProvider>
                  </Box>
                </Stack>
              </CardContent>
            </CardMedia>
            <CardContent
              sx={{
                minWidth: "100%",
                maxWidth: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Stack
                direction="column"
                sx={{
                  minWidth: "100%",
                  maxWidth: "100%",
                }}
              >
                <Typography
                  textAlign="center"
                  variant="h4"
                  fontSize="lg"
                  fontWeight={"bold"}
                >
                  {props.title}
                </Typography>
                {/* </CardContent> */}
                {/* <CardContent> */}
                <Typography textAlign="left">{props.subtitle}</Typography>
              </Stack>
            </CardContent>

            <CardContent>
              <Typography marginLeft={4}>
                Starts: {props.start_date_day} {props.start_date.split("/")[0]}{" "}
                {props.start_date_month}
              </Typography>
              <Typography marginLeft={4}>
                {props.end_date !== null
                  ? `Ends: ${props.end_date_day} ${
                      props.end_date.split("/")[0]
                    } ${props.end_date_month}`
                  : ""}
              </Typography>
            </CardContent>

            <CardContent>
              <Typography
                variant="h6"
                fontSize="md"
                mt={1}
                marginLeft={4}
                marginRight={2}
              >
                {props.description}
              </Typography>
            </CardContent>
          </Card>
          <Modal
            sx={{ overflow: "auto" }}
            open={unfollowPopup}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={popupStyle}>
              <ConfirmAction
                unfollow={unfollow}
                setUnfollowPopup={setUnfollowPopup}
                message={"Unfollow event?"}
              />
            </Box>
          </Modal>
        </Container>
      </>
    );
  } else {
    return <EventPage />;
  }
};

export default EventCard2;
