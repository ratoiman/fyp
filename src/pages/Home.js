import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import GuestLandingPage from "./GuestLandingPage";
import EventCard2 from "../components/EventCard2";
import EventPage from "./EventPage";
import Loading from "../components/Loading";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { getEventsDetails, getEvents } from "../context/DbCallsContext";
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
import EditEvent from "../components/EditEvent";
import FilterSearchEvent from "../components/FilterSearchEvent";
import { collection, onSnapshot } from "firebase/firestore";

const Home = () => {
  const [events, setEvents] = useState(new Set());
  const [eventsDetails, setEventsDetails] = useState([]);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventPageLoad, setEventPageLoad] = useState(false);
  const [displayEvents, setDisplayEvents] = useState(true);
  const [editEventDetails, setEditEventDetails] = useState(new Object());
  const [editSelectedEvent, setEditSelectedEvent] = useState(false);
  const [refreshSearch, setRefreshSearch] = useState(0);
  const [filtered, setFiltered] = useState(false);
  const [filteredEventsDetails, setFilteredEventsDetails] = useState([]);
  const [userEvents, setUserEvents] = useState(new Set());
  const [eventsDetailsSorted, setEventsDetailsSorted] = useState([]);

  const { user } = useUserAuth();

  const handleEventLink = (id, privacy) => {
    // navigator("/event")
    console.log(userEvents);
    if (userEvents.has(id) || privacy === "Public") {
      setSelectedEventID(id);
      setEventPageLoad(true);
    } else {
      console.log("Alertssss", privacy, id);
    }
  };

  const getUserEvents = () => {
    try {
      if (user !== null) {
        if (Object.keys(user).length !== 0) {
          const usersRef = collection(db, "users", user.uid, "events");
          onSnapshot(usersRef, async (snap) => {
            snap.docs.map((doc) => {
              setUserEvents((users) => new Set([...users, doc.id]));
            });
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getEditEventDetails = (id) => {
    let arr = Array.from(eventsDetails);
    let found = arr.find((ev) => ev["id"] === id);
    console.log("found ", id);
    console.log("arr ", arr);
    if (found) {
      setEditEventDetails(found);
    }
  };

  const handleEdit = (id) => {
    console.log("id ", id);
    setSelectedEventID(id);
    getEditEventDetails(id);
    setEventPageLoad(true);
    setEditSelectedEvent(true);
  };

  const refreshEdit = () => {
    console.log("refresh");
    setIsLoading(true);
    setUserEvents(new Set());
    setEvents(new Set());
    setEventsDetails([]);
    getEvents(db, setIsLoading, setEvents);
    getEventsDetails(db, events, eventsDetails, setEventsDetails);
  };

  const refreshSearchResult = () => {
    setRefreshSearch(refreshSearch + 1);
    setFiltered(false);
    // setEvents(new Set());
    setEventsDetails([]);
    // getEvents(db, setIsLoading, setEvents);
    // getEventsDetails(db, events, eventsDetails, setEventsDetails);
  };

  const closeEvent = () => {
    // navigator("/event")
    setSelectedEventID(null);
    setEventPageLoad(false);
    console.log("page load ", eventPageLoad);
  };

  const loading = () => {
    if (eventsDetails.length > 0) {
      setIsLoading(false);
    } else {
      if (filtered) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    }
  };

  useEffect(() => {
    getEvents(db, setIsLoading, setEvents);
  }, [user, refreshSearch]);

  useEffect(() => {
    getUserEvents();
  }, [user, events, eventsDetails]);

  useEffect(() => {
    getEventsDetails(db, events, eventsDetails, setEventsDetails);
  }, [events]);

  useEffect(() => {
    loading();
  }, [eventsDetails]);

  useEffect(() => {
    const temp = eventsDetails.sort(function (a, b) {
      return (
        (
          a["details"].start_date.split("/")[1] +
          "/" +
          a["details"].start_date.split("/")[0] +
          "/" +
          a["details"].start_date.split("/")[2]
        ).localeCompare(
          b["details"].start_date.split("/")[1] +
            "/" +
            b["details"].start_date.split("/")[0] +
            "/" +
            b["details"].start_date.split("/")[2]
        ) ||
        a["details"].start_time.localeCompare(b["details"].start_time) ||
        (
          a["details"].end_date.split("/")[1] +
          "/" +
          a["details"].end_date.split("/")[0] +
          "/" +
          a["details"].end_date.split("/")[2]
        ).end_date.localeCompare(
          b["details"].end_date.split("/")[1] +
            "/" +
            b["details"].end_date.split("/")[0] +
            "/" +
            b["details"].end_date.split("/")[2]
        ) ||
        a["details"].end_time.localeCompare(b["details"].end_time)
      );
    });
    setEventsDetailsSorted(temp);
  });

  console.log(eventsDetailsSorted);
  if (user) {
    if (eventPageLoad === false) {
      if (!isLoading) {
        if (eventsDetails.length > 0 || filtered) {
          return (
            <>
              <Box
                className={
                  isMobile
                    ? "display-events-category-box-mobile"
                    : "display-events-category-box"
                }
              >
                <Typography variant="h4" align="center"></Typography>

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
                        Discover exciting events
                      </Typography>
                      <Box sx={{ justifyContent: "right" }}>
                        <ThemeProvider theme={submitButtonTheme}>
                          <Button
                            sx={{ width: "35px" }}
                            size="large"
                            startIcon={
                              displayEvents === false ? (
                                <ExpandMoreIcon />
                              ) : (
                                <ExpandLessIcon />
                              )
                            }
                            onClick={() => setDisplayEvents(!displayEvents)}
                          />
                        </ThemeProvider>
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <FilterSearchEvent
                      eventsDetails={eventsDetails}
                      searchType="general"
                      events={events}
                      setEventsDetails={setEventsDetails}
                      refreshSearch={refreshSearchResult}
                      setFiltered={setFiltered}
                      setFilteredEventsDetails={setFilteredEventsDetails}
                    />
                  </Box>

                  <Box display={displayEvents === true ? "" : "none"}>
                    {eventsDetails.length > 0 ? (
                      filtered ? (
                        filteredEventsDetails.length > 0 ? (
                          filteredEventsDetails.map((eventDetails) => {
                            // Work around for a bug where follow status was not showing propperly after filtering
                            let admin = false;
                            let following = false;

                            let found = Array.from(eventDetails["users"]).find(
                              (ev) => ev.id === user.uid
                            );

                            if (found) {
                              if (found.status === "admin") {
                                admin = true;
                                following = true;
                              } else {
                                following = true;
                              }
                            }

                            return (
                              <EventCard2
                                filtered={filtered}
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
                                end_date_day={
                                  eventDetails["details"].end_date_day
                                }
                                end_date_month={
                                  eventDetails["details"].end_date_month
                                }
                                end_time={eventDetails["details"].end_time}
                                description={
                                  eventDetails["details"].description
                                }
                                author={eventDetails["details"].author_username}
                                instagram={eventDetails["details"].instagram}
                                tiktok={eventDetails["details"].tiktok}
                                twitter={eventDetails["details"].twitter}
                                facebook={eventDetails["details"].facebook}
                                privacy={eventDetails["details"].privacy}
                                category={eventDetails["details"].category}
                                locationType={
                                  eventDetails["details"].location_type
                                }
                                locationString={
                                  eventDetails["details"].location_string
                                }
                                locationDisplayName={
                                  eventDetails["details"].location_display_name
                                }
                                marker={eventDetails["details"].marker}
                                activities={eventDetails["activities"]}
                                usersList={eventDetails["users"]}
                                userEvents={events}
                                eventID={eventDetails.id}
                                handleEventLink={handleEventLink}
                                isFollowing={following}
                                isAdmin={admin}
                                followingOnly={false}
                                handleEdit={handleEdit}
                                setEditSelectedEvent={setEditSelectedEvent}
                                joinCode={eventDetails["details"].join_code}
                                refreshEdit={refreshEdit}
                              />
                            );
                          })
                        ) : (
                          <>
                            <Box color="gray" sx={{ paddingLeft: 1.5 }}>
                              {filtered
                                ? "No results, try changing the filter settings"
                                : `error`}
                            </Box>
                          </>
                        )
                      ) : (
                        eventsDetails.map((eventDetails) => {
                          // Work around for a bug where follow status was not showing propperly after filtering
                          let admin = false;
                          let following = false;

                          let found = Array.from(eventDetails["users"]).find(
                            (ev) => ev.id === user.uid
                          );

                          if (found) {
                            if (found.status === "admin") {
                              admin = true;
                              following = true;
                            } else {
                              following = true;
                            }
                          }

                          return (
                            <EventCard2
                              filtered={filtered}
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
                              end_date_day={
                                eventDetails["details"].end_date_day
                              }
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
                              locationType={
                                eventDetails["details"].location_type
                              }
                              locationString={
                                eventDetails["details"].location_string
                              }
                              locationDisplayName={
                                eventDetails["details"].location_display_name
                              }
                              marker={eventDetails["details"].marker}
                              activities={eventDetails["activities"]}
                              usersList={eventDetails["users"]}
                              userEvents={events}
                              eventID={eventDetails.id}
                              handleEventLink={handleEventLink}
                              isFollowing={following}
                              isAdmin={admin}
                              followingOnly={false}
                              handleEdit={handleEdit}
                              setEditSelectedEvent={setEditSelectedEvent}
                              joinCode={eventDetails["details"].join_code}
                              refreshEdit={refreshEdit}
                            />
                          );
                        })
                      )
                    ) : (
                      <>
                        <Box color="gray" sx={{ paddingLeft: 1.5 }}>
                          {filtered
                            ? "No results, try changing the filter settings"
                            : `error`}
                        </Box>
                      </>
                    )}
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
        return (
          <>
            <Box
              className={
                isMobile
                  ? "display-events-category-box-mobile"
                  : "display-events-category-box"
              }
            >
              <EventPage
                eventID={selectedEventID}
                closeEvent={closeEvent}
                refreshSearch={refreshSearchResult}
              />
            </Box>
          </>
        );
      }
    }
  } else {
    return <GuestLandingPage />;
  }
};

export default Home;
