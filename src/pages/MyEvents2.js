import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Loading from "../components/Loading";
import EventPage from "./EventPage";
import EventCard2 from "../components/EventCard2";
import { isMobile } from "react-device-detect";
import {
  display_events_category_box_title,
  display_events_category_box_title_stack,
} from "../ui_styles/MuiStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ThemeProvider } from "@mui/material/styles";
import { submitButtonTheme } from "../ui_styles/MuiStyles";
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import EditEvent from "../components/EditEvent";
import { isEqual } from "lodash";

const MyEvents2 = (props) => {
  const { user } = useUserAuth();
  const [userEvents, setUserEvents] = useState(new Set());
  const [userEventsArr, setUserEventsArr] = useState([]);
  const [userEventsDetails, setUserEventsDetails] = useState([]);
  const [eventPageLoad, setEventPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displaySubscribed, setDisplaySubscribed] = useState(true);
  const [displayAdministrated, setDisplayAdministrated] = useState(true);
  const [selectedEventID, setSelectedEventID] = useState("");
  const [editSelectedEvent, setEditSelectedEvent] = useState(false);
  const [editEventDetails, setEditEventDetails] = useState(new Object());

  const getUserEvents = () => {
    try {
      if (user !== null) {
        if (Object.keys(user).length !== 0) {
          const usersRef = collection(db, "users", user.uid, "events");
          onSnapshot(usersRef, async (snap) => {
            if (snap.docChanges().length === 0) {
              setIsLoading(false);
            }

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

  const getUserEventsDetails = () => {
    userEventsArr.map(async (event) => {
      const found = userEventsDetails.find((ev) => ev["id"] === event.id);
      console.log("user details ", userEventsDetails);

      if (!found) {
        let eventObj = new Object();
        let activities = [];
        let users = new Set();
        const eventRef = doc(db, "events", event.id, "data", "event_details");
        const eventUsersRef = collection(db, "events", event.id, "users");
        const activitiesRef = collection(db, "events", event.id, "activities");
        const usersDocs = await getDocs(eventUsersRef);
        const eventDetailsDoc = await getDoc(eventRef);
        const activitiesDocs = await getDocs(
          query(
            activitiesRef,
            orderBy("start_date"),
            orderBy("start_time"),
            orderBy("end_date"),
            orderBy("end_time")
          )
        );
        eventObj["activities"] = {};

        activitiesDocs.docs.map((activity) => {
          let act = new Object(activity.data());
          act["id"] = activity.id;
          activities.push(act);
        });

        usersDocs.docs.map((user) => {
          let us = new Object();
          us["id"] = user.id.toString().trim();
          us["status"] = user.data()["status"];
          users.add(us);
        });

        eventObj["details"] = eventDetailsDoc.data();
        eventObj["users"] = users;
        eventObj["activities"] = activities;
        eventObj["id"] = event.id;

        setUserEventsDetails((eventDetails) => [...eventDetails, eventObj]);
      }
    });
  };

  const getEditEventDetails = (id) => {
    getUserEvents();
    getUserEventsDetails();
    let arr = Array.from(userEventsDetails);
    let found = arr.find((ev) => ev["id"] === id);
    console.log("found ", id);
    console.log("arr ", arr);
    if (found) {
      setEditEventDetails(found);
    }
  };

  const loading = () => {
    if (userEventsDetails.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };

  const handleEventLink = (id) => {
    // navigator("/event")
    setSelectedEventID(id);
    setEventPageLoad(true);
  };

  const handleEdit = (id) => {
    console.log("id ", id);
    setSelectedEventID(id);
    getEditEventDetails(id);
    setEventPageLoad(true);
    setEditSelectedEvent(true);
  };

  const closeEvent = () => {
    // navigator("/event")
    setSelectedEventID(null);
    setEventPageLoad(false);
  };

  const refreshEdit = () => {
    setUserEvents(new Set());
    setUserEventsArr([]);
    setUserEventsDetails([]);

    getUserEvents();
    getUserEventsDetails();
  };

  useEffect(() => {
    getUserEvents();
  }, [user]);

  useEffect(() => {
    setUserEventsArr(Array.from(userEvents));
  }, [userEvents]);

  useEffect(() => {
    getUserEventsDetails();
  }, [userEventsArr]);

  useEffect(() => {
    loading();
  }, [userEventsDetails]);

  if (user) {
    if (eventPageLoad === false) {
      if (!isLoading) {
        if (userEventsDetails.length > 0) {
          return (
            <>
              <Box
                className={
                  isMobile
                    ? "display-events-category-box-mobile"
                    : "display-events-category-box"
                }
              >
                <Stack direction="column">
                  <Box className="my-events-page-category-title-box">
                    <Stack
                      direction="row"
                      sx={display_events_category_box_title_stack}
                    >
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        align="center"
                        sx={display_events_category_box_title}
                      >
                        {" "}
                        Administrated events
                      </Typography>
                      <Box sx={{ justifyContent: "right" }}>
                        <ThemeProvider theme={submitButtonTheme}>
                          <Button
                            sx={{ width: "35px", transform: "translateX(5px)" }}
                            size="large"
                            startIcon={
                              displayAdministrated === false ? (
                                <ExpandMoreIcon />
                              ) : (
                                <ExpandLessIcon />
                              )
                            }
                            onClick={() =>
                              setDisplayAdministrated(!displayAdministrated)
                            }
                          />
                        </ThemeProvider>
                      </Box>
                    </Stack>
                  </Box>

                  <Box display={displayAdministrated === true ? "" : "none"}>
                    {userEventsDetails.map((eventDetails) => {
                      const found = userEvents.find(
                        (ev) => ev["id"] === eventDetails.id
                      );
                      if (found.status === "admin") {
                        return (
                          <EventCard2
                            title={eventDetails["details"].title}
                            subtitle={eventDetails["details"].subtitle}
                            start_date={eventDetails["details"].start_date}
                            start_date_day={
                              eventDetails["details"].start_date_day
                            }
                            start_date_month={
                              eventDetails["details"].start_date_month
                            }
                            start_time={eventDetails["details"].start_time}
                            end_date={eventDetails["details"].end_date}
                            end_date_day={eventDetails["details"].end_date_day}
                            end_date_month={
                              eventDetails["details"].end_date_month
                            }
                            end_time={eventDetails["details"].end_time}
                            description={eventDetails["details"].description}
                            author={eventDetails["details"].author_username}
                            instagram={eventDetails["details"].instagram}
                            tiktok={eventDetails["details"].tiktok}
                            twitter={eventDetails["details"].twitter}
                            facebook={eventDetails["details"].facebook}
                            privacy={eventDetails["details"].privacy}
                            category={eventDetails["details"].category}
                            locationType={eventDetails["details"].location_type}
                            locationString={
                              eventDetails["details"].location_string
                            }
                            locationDisplayName={
                              eventDetails["details"].location_display_name
                            }
                            marker={eventDetails["details"].marker}
                            activities={eventDetails["activities"]}
                            usersList={eventDetails["users"]}
                            eventID={eventDetails.id}
                            userEventsDetails={userEventsDetails}
                            handleEventLink={handleEventLink}
                            followingOnly={true}
                            handleEdit={handleEdit}
                            setEditSelectedEvent={setEditSelectedEvent}
                          />
                        );
                      }
                    })}
                  </Box>
                </Stack>
              </Box>

              <Box
                className={
                  isMobile
                    ? "display-events-category-box-mobile"
                    : "display-events-category-box"
                }
              >
                <Stack direction="column">
                  <Box className="my-events-page-category-title-box">
                    <Stack
                      direction="row"
                      sx={display_events_category_box_title_stack}
                    >
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        align="center"
                        sx={display_events_category_box_title}
                      >
                        {" "}
                        Events that you follow
                      </Typography>
                      <Box sx={{ justifyContent: "right" }}>
                        <ThemeProvider theme={submitButtonTheme}>
                          <Button
                            sx={{ width: "35px" }}
                            size="large"
                            startIcon={
                              displaySubscribed === false ? (
                                <ExpandMoreIcon />
                              ) : (
                                <ExpandLessIcon />
                              )
                            }
                            onClick={() =>
                              setDisplaySubscribed(!displaySubscribed)
                            }
                          />
                        </ThemeProvider>
                      </Box>
                    </Stack>
                  </Box>
                  <Box display={displaySubscribed === true ? "" : "none"}>
                    {userEventsDetails.map((eventDetails) => {
                      const found = userEvents.find(
                        (ev) => ev["id"] === eventDetails.id
                      );
                      if (found.status === "guest") {
                        return (
                          <EventCard2
                            title={eventDetails["details"].title}
                            subtitle={eventDetails["details"].subtitle}
                            start_date={eventDetails["details"].start_date}
                            start_date_day={
                              eventDetails["details"].start_date_day
                            }
                            start_date_month={
                              eventDetails["details"].start_date_month
                            }
                            start_time={eventDetails["details"].start_time}
                            end_date={eventDetails["details"].end_date}
                            end_date_day={eventDetails["details"].end_date_day}
                            end_date_month={
                              eventDetails["details"].end_date_month
                            }
                            end_time={eventDetails["details"].end_time}
                            description={eventDetails["details"].description}
                            author={eventDetails["details"].author_username}
                            instagram={eventDetails["details"].instagram}
                            tiktok={eventDetails["details"].tiktok}
                            twitter={eventDetails["details"].twitter}
                            facebook={eventDetails["details"].facebook}
                            privacy={eventDetails["details"].privacy}
                            category={eventDetails["details"].category}
                            locationType={eventDetails["details"].location_type}
                            locationString={
                              eventDetails["details"].location_string
                            }
                            locationDisplayName={
                              eventDetails["details"].location_display_name
                            }
                            marker={eventDetails["details"].marker}
                            activities={eventDetails["activities"]}
                            usersList={eventDetails["users"]}
                            eventID={eventDetails.id}
                            userEventsDetails={userEventsDetails}
                            handleEventLink={handleEventLink}
                            handleEdit={handleEdit}
                            setEditSelectedEvent={setEditSelectedEvent}
                            followingOnly={true}
                          />
                        );
                      }
                    })}
                  </Box>
                </Stack>
              </Box>
            </>
          );
        } else {
          return (
            <>
              <Box> You currently have no events. Try discovering some</Box>
            </>
          );
        }
      } else {
        return (
          <>
            <Loading />
          </>
        );
      }
    } else {
      if (editSelectedEvent === true) {
        return (
          <>
            <EditEvent
              eventID={selectedEventID}
              setEditSelectedEvent={setEditSelectedEvent}
              setEventPageLoad={setEventPageLoad}
              eventDetails={editEventDetails}
              closeEvent={closeEvent}
              refreshEdit={refreshEdit}
            />
          </>
        );
      } else {
        console.log("edit");
        return (
          <>
            <Box
              className={
                isMobile
                  ? "display-events-category-box-mobile"
                  : "display-events-category-box"
              }
            >
              <EventPage eventID={selectedEventID} closeEvent={closeEvent} />
            </Box>
          </>
        );
      }
    }
  }
};

export default MyEvents2;
