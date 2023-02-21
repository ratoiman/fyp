import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import GuestLandingPage from "./GuestLandingPage";
import EventCard from "../components/EventCard";
import EventCard2 from "../components/EventCard2";
import EventPage from "./EventPage";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import { Box } from "@mui/material";
import { getEventsDetails, getEvents } from "../context/DbCallsContext";
import { collection, onSnapshot } from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(new Set());
  const [eventsDetails, setEventsDetails] = useState([]);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventPageLoad, setEventPageLoad] = useState(false);
  const [latestFollow, setLatestFollow] = useState("");

  const { user } = useUserAuth();

  const handleNavigation = () => {
    if (Object.keys(user).length !== 0) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  const handleEventLink = (id) => {
    // navigator("/event")
    setSelectedEventID(id);
    setEventPageLoad(true);
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

  const handleNav = (nav) => {
    navigate(nav);
  };

  if (user) {
    if (eventPageLoad === false) {
      if (!isLoading) {
        if (eventsDetails.length > 0) {
          return (
            <>
              <Box>
                {eventsDetails.map((eventDetails) => {
                  return (
                    <EventCard2
                      title={eventDetails["details"].title}
                      subtitle={eventDetails["details"].subtitle}
                      start_date={eventDetails["details"].start_date}
                      start_date_day={eventDetails["details"].start_date_day}
                      start_date_month={
                        eventDetails["details"].start_date_month
                      }
                      start_time={eventDetails["details"].start_time}
                      end_date={eventDetails["details"].end_date}
                      end_date_day={eventDetails["details"].end_date_day}
                      end_date_month={eventDetails["details"].end_date_month}
                      end_time={eventDetails["details"].end_time}
                      description={eventDetails["details"].description}
                      author={eventDetails["details"].author_username}
                      activities={eventDetails["activities"]}
                      usersList={eventDetails["users"]}
                      userEvents={events}
                      eventID={eventDetails.id}
                      followingOnly={true}
                    />
                  );
                })}
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
      return (
        <>
          <EventPage
            setSelectedEventID={setSelectedEventID}
            setEventPageLoad={setEventPageLoad}
            eventID={selectedEventID}
          />
        </>
      );
    }
  } else {
    return <GuestLandingPage />;
  }
};

export default Home;
