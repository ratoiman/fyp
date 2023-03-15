import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import GuestLandingPage from "./GuestLandingPage";
import EventCard2 from "../components/EventCard2";
import EventPage from "./EventPage";
import Loading from "../components/Loading";
import { Box, Stack, Typography } from "@mui/material";
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

const Home = () => {
  const [events, setEvents] = useState(new Set());
  const [eventsDetails, setEventsDetails] = useState([]);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventPageLoad, setEventPageLoad] = useState(false);
  const [displayEvents, setDisplayEvents] = useState(true);
  const [editEventDetails, setEditEventDetails] = useState(new Object());
  const [editSelectedEvent, setEditSelectedEvent] = useState(false);

  const { user } = useUserAuth();

  const handleEventLink = (id) => {
    // navigator("/event")
    setSelectedEventID(id);
    setEventPageLoad(true);
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
    setEvents(new Set());
    setEventsDetails([]);
    getEvents(db, setIsLoading, setEvents);
    getEventsDetails(db, events, eventsDetails, setEventsDetails);
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
      setIsLoading(true);
    }
  };

  useEffect(() => {
    getEvents(db, setIsLoading, setEvents);
  }, [user]);

  useEffect(() => {
    getEventsDetails(db, events, eventsDetails, setEventsDetails);
  }, [events]);

  useEffect(() => {
    loading();
  }, [eventsDetails]);

  console.log("page load ", eventPageLoad, "edit ", editSelectedEvent);
  if (user) {
    if (eventPageLoad === false) {
      if (!isLoading) {
        if (eventsDetails.length > 0) {
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
                  <Box display={displayEvents === true ? "" : "none"}>
                    {eventsDetails.map((eventDetails) => {
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
                          userEvents={events}
                          eventID={eventDetails.id}
                          handleEventLink={handleEventLink}
                          followingOnly={false}
                          handleEdit={handleEdit}
                          setEditSelectedEvent={setEditSelectedEvent}
                        />
                      );
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
  } else {
    return <GuestLandingPage />;
  }
};

export default Home;
