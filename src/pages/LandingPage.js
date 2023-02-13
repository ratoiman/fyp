import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import Event from "../components/Event";
import GuestLandingPage from "./GuestLandingPage";
import EventCard from "../components/EventCard";
import EventPage from "./EventPage";

const LandingPage = () => {
  const navigate = useNavigate();
  const [userEvents, setUserEvents] = useState([]);
  const [userEventsDetails, setUserEventsDetails] = useState([]);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [eventPageLoad, setEventPageLoad] = useState(false);

  const { user } = useUserAuth();

  const handleNavigation = () => {
    if (Object.keys(user).length !== 0) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  const getUserEvents = () => {
    try {
      if (user !== null) {
        if (Object.keys(user).length !== 0) {
          const usersRef = collection(db, "users", user.uid, "events");
          onSnapshot(usersRef, async () => {
            const data = await getDocs(usersRef);
            setUserEvents(
              data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEventLink = (id) => {
    // navigator("/event")
    setSelectedEventID(id);
    setEventPageLoad(true);
  };

  const getEventsDetails = () => {
    userEvents.map(async (event) => {
      let eventObj = new Object();
      let activities = [];
      const eventRef = doc(db, "events", event.id, "data", "event_details");
      const activitiesRef = collection(db, "events", event.id, "activities");
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

      eventObj["details"] = eventDetailsDoc.data();
      eventObj["activities"] = activities;
      eventObj["id"] = event.id;
      setUserEventsDetails((eventDetails) => [...eventDetails, eventObj]);
    });
  };

  useEffect(() => {
    getUserEvents();
  }, [user]);

  useEffect(() => {
    getEventsDetails();
  }, [userEvents]);

  function GreetGuest() {
    return (
      <div>
        Hi guest
        <Button onClick={handleNavigation}>Log in</Button>
      </div>
    );
  }

  function GreetUser() {
    const currentUser = JSON.parse(localStorage.getItem("user")).email;
    return (
      <div>
        <Button onClick={handleNavigation}>Home Page</Button>
        <p>Welcome {currentUser}</p>
      </div>
    );
  }

  const handleNav = (nav) => {
    navigate(nav);
  };

  if (user) {
    if (eventPageLoad === false) {
      return (
        <>
          <Button
            onClick={() => {
              handleNav("/home");
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => {
              handleNav("/login");
            }}
          >
            Login
          </Button>{" "}
          {userEventsDetails.map((eventDetails) => {
            // console.log("Title: ", eventDetails.title ,"End date: ",eventDetails.end_date)
            // console.log("Event details ",eventDetails["activities"])
            return (
              <EventCard
                title={eventDetails["details"].title}
                subtitle={eventDetails["details"].subtitle}
                start_date={eventDetails["details"].start_date}
                start_time={eventDetails["details"].start_time}
                end_date={eventDetails["details"].end_date}
                end_time={eventDetails["details"].end_time}
                description={eventDetails["details"].description}
                author={eventDetails["details"].author_username}
                activities={eventDetails["activities"]}
                eventID={eventDetails.id}
                handleEventLink={(id) => {
                  handleEventLink(id);
                }}
              />
            );
          })}
        </>
      );
    } else {
      return (
        <>
          <Button
            onClick={() => {
              handleNav("/home");
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => {
              handleNav("/login");
            }}
          >
            Login
          </Button>{" "}
          <EventPage eventID={selectedEventID} />
        </>
      );
    }
  } else {
    return <GuestLandingPage />;
  }
};

export default LandingPage;
