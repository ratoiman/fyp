import React from "react";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import texture from "../resources/texture.jpeg";
import {
  event_card_style_desktop,
  event_card_style_mobile,
  submitButtonTheme,
  follow_button,
  following_button,
  popupStyle,
  card_action_style,
  card_action_style_mobile,
  privacyAndCategoryTheme,
} from "../ui_styles/MuiStyles";
import { isMobile } from "react-device-detect";
import { Box, CardActionArea, Modal, Stack } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ThemeProvider } from "@mui/material/styles";
import { useUserAuth } from "../context/UserAuthContext";
import { handleFollow, handleUnfollow } from "../context/DbCallsContext";
import { db } from "../utils/firebase";
import { onSnapshot } from "firebase/firestore";
import { collection } from "firebase/firestore";
import ConfirmAction from "./ConfirmAction";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

const EventCard2 = (props) => {
  const [userEvents, setUserEvents] = useState(new Set());
  const [eventPageLoad, setEventPageLoad] = useState(false);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unfollowPopup, setUnfollowPopup] = useState(false);
  const { user } = useUserAuth();

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

    let arr = Array.from(userEvents);
    let found = arr.find((ev) => ev["id"] === props.eventID);

    if (found) {
      setIsFollowing(true);
      if (found.status === "admin") {
        setIsAdmin(true);
      }
    } else {
      setIsFollowing(false);
      setIsAdmin(false);
    }
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

  useEffect(() => {
    getUserEvents();
  }, [user]);

  useEffect(() => {
    const n = new Date();
    console.log("follow", n.getTime());
    getFollowStatus();
  }, [userEvents]);

  // {
  //   console.log("event card location type", props.locationType);
  // }
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
                minHeight: "55px",
                maxHeight: "100px",
                minWidth: "100%",
                display: "flex",
              }}
            >
              <CardContent
                sx={{
                  minWidth: "100%",
                  minHeight: "65px",
                  display: "flex",
                }}
              >
                {" "}
                <Stack
                  direction="row"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <ThemeProvider theme={privacyAndCategoryTheme}>
                    <Box sx={{ marginTop: "1px" }}>
                      <Button
                        disableElevation
                        disableRipple
                        variant="text"
                        color={
                          props.privacy === "Public" ? "primary" : "secondary"
                        }
                        startIcon={
                          props.privacy === "Public" ? (
                            <PublicOutlinedIcon style={{ height: "15px" }} />
                          ) : (
                            <LockOutlinedIcon style={{ height: "15px" }} />
                          )
                        }
                      >
                        {props.privacy}
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        disableElevation
                        disableRipple
                        variant="text"
                        color="primary"
                        sx={{ marginTop: "1px" }}
                      >
                        {props.category === "Category"
                          ? "General"
                          : props.category}
                      </Button>
                    </Box>
                  </ThemeProvider>
                  <Box
                    sx={{
                      width: "100%",
                      marginLeft: "10px",
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "left",
                        marginTop: "6px",
                      }}
                    >
                      <Typography
                        // variant="h7"
                        sx={{ color: "rgb(173, 173, 173)", paddingRight: "1%" }}
                      >
                        {props.locationDisplayName === undefined &&
                        props.locationString === undefined ? (
                          <></>
                        ) : props.locationType === "Online" ? (
                          <VideoCameraFrontOutlinedIcon
                            style={{ height: "15px" }}
                          />
                        ) : (
                          <LocationOnOutlinedIcon style={{ height: "15px" }} />
                        )}
                      </Typography>
                      <Typography
                        variant="h7"
                        sx={{ color: "rgb(173, 173, 173)" }}
                      >
                        {props.locationDisplayName === ""
                          ? props.locationString === ""
                            ? props.locationType === "Online"
                              ? "Online event"
                              : "In person event"
                            : props.locationString
                          : props.locationDisplayName}{" "}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <ThemeProvider theme={privacyAndCategoryTheme}>
                      {isFollowing ? (
                        <Button
                          onClick={() => {
                            if (isAdmin) {
                              props.handleEdit(props.eventID);
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
            <CardActionArea
              sx={isMobile ? card_action_style_mobile : card_action_style}
              onClick={() => props.handleEventLink(props.eventID)}
            >
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
                    color={"white"}
                  >
                    {props.title}
                  </Typography>
                  {/* </CardContent> */}
                  {/* <CardContent> */}
                  <Typography textAlign="left" color={"white"}>
                    {props.subtitle}
                  </Typography>
                </Stack>
              </CardContent>

              <CardContent>
                <Typography marginLeft={4} color={"white"}>
                  Starts: {props.start_date_day}{" "}
                  {props.start_date.split("/")[0]} {props.start_date_month}
                </Typography>
                <Typography marginLeft={4} color={"white"}>
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
                  color={"white"}
                >
                  {props.description}
                </Typography>
              </CardContent>
            </CardActionArea>
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
  }
};

export default EventCard2;
