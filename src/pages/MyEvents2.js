import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
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
  deleteDoc,
} from "firebase/firestore";
import Loading from "../components/Loading";
import EventPage from "./EventPage";
import EventCard2 from "../components/EventCard2";
import { getUserEventsDetails, getUserEvents } from "../context/DbCallsContext";

const MyEvents2 = () => {
  const { user } = useUserAuth();
  const [userEvents, setUserEvents] = useState(new Set());
  const [userEventsArr, setUserEventsArr] = useState([]);
  const [userEventsDetails, setUserEventsDetails] = useState([]);
  const [eventPageLoad, setEventPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  let eve = [];

  const handleDelete = async (db, userID, eventID) => {
    const userRef = doc(db, "users", userID, "events", eventID);
    const eventRef = doc(db, "events", eventID, "users", userID);
    console.log("before ", userEventsDetails);
    const objInd = userEventsDetails.findIndex((obj) => obj.id === eventID);
    userEventsDetails.splice(objInd, 1);
    console.log("after ", userEventsDetails);
    await deleteDoc(userRef);
    await deleteDoc(eventRef);

    const toRemove = console.log("doc ", eventID, " deleted");
  };

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
      // console.log("event ", event);
      const found = userEventsDetails.find((ev) => ev["id"] === event.id);

      console.log("founds ", !found, found);
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

        let old = [userEventsDetails];

        console.log("old ", old);

        setUserEventsDetails((eventDetails) => {
          const spread = [...eventDetails, eventObj];
          // console.log("spread ", spread.length, spread);
          return spread;
        });
        eve.push(eventObj);
      }
    });
  };

  const loading = () => {
    if (userEventsDetails.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
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

  // useEffect(() => {
  //   console.log("detials");
  //   getEventsDetails();
  // }, [userEventsArr]);

  // console.log("event ", userEventsDetailsArr)

  if (user) {
    if (eventPageLoad === false) {
      if (!isLoading) {
        if (userEventsDetails.length > 0) {
          return (
            <>
              <Box>
                {userEventsDetails.map((eventDetails) => {
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
                      eventID={eventDetails.id}
                      userEventsDetails={userEventsDetails}
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
    }
  }
};

export default MyEvents2;
