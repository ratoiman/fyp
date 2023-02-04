import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import Event from "../components/Event";
import GuestLandingPage from "./GuestLandingPage";

const LandingPage = () => {
  const navigate = useNavigate();
  const [userEvents, setUserEvents] = useState([]);
  const [userEventsDetails, setUserEventsDetails] = useState([]);
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

  const getEventsDetails = () => {
    userEvents.map(async (event) => {
      console.log("user events set map");
      const eventRef = doc(db, "events", event.id, "data", "event_details");
      const eventDetailsDoc = await getDoc(eventRef);
      console.log("eventDetailsDoc ", eventDetailsDoc.data());
      setUserEventsDetails((eventDetails) => [
        ...eventDetails,
        eventDetailsDoc.data(),
      ]);
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
        {console.log(
          userEventsDetails.sort((a, b) =>
            a.start_date > b.start_date
              ? 1
              : b.start_date > a.start_date
              ? -1
              : a.start_time > b.start_time
              ? 1
              : b.start_time > a.start_time
              ? -1
              : 0
          )
        )}
        {userEventsDetails.map((eventDetails) => {
          return (
            <Event
              title={eventDetails.title}
              subtitle={eventDetails.subtitle}
              start_date={eventDetails.start_date}
              start_time={eventDetails.start_time}
              end_date={eventDetails.end_date}
              end_time={eventDetails.end_time}
              description={eventDetails.description}
              author={eventDetails.author_username}
            />
          );
        })}
      </>
    );
  } else {
    return <GuestLandingPage />;
  }
};

export default LandingPage;
