import React, { useState } from "react";
import { Container } from "react-bootstrap";
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
import { useEffect } from "react";

const EventPage = (props) => {
  const { user } = useUserAuth();

  const [eventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getEventsDetails = async () => {
    let eventObj = new Object();
    let activities = [];
    const eventRef = doc(db, "events", props.eventID, "data", "event_details");
    const activitiesRef = collection(db, "events", props.eventID, "activities");
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
    eventObj["id"] = props.eventID;
    setEventData(eventObj);
  };

  useEffect(() => {
    getEventsDetails();
  }, []);

  useEffect(() => {
    if (eventData.length !== 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [eventData]);

  if (!isLoading) {
    return (
      <Container className="card mt-5 w-100 p-4 bg-black">
        <div className="text-white">Title: {eventData["details"].title}</div>
        <div className="text-white">
          Subtitle: {eventData["details"].subtitle}
        </div>
        <div className="text-white">
          Start Date: {eventData["details"].start_date}
        </div>
        <div className="text-white">
          Start Time: {eventData["details"].start_time}
        </div>
        <div className="text-white">
          End Date: {eventData["details"].end_date}
        </div>
        <div className="text-white">
          End Time: {eventData["details"].end_time}
        </div>
        <div className="text-white">
          Description: {eventData["details"].description}
        </div>

        ACTIVITIES
        <div className="text-white">
          {eventData["activities"].map((activity) => {
            {
              console.log("Act ", activity.title);
            }
            return (
              <>
                <div>Title: {activity.title}</div>
              </>
            );
          })}
        </div>
      </Container>
    );
  } else {
    return (
      <>
        <div>
          {" "}
          <h1 style={{color:"#DAA520"}}> LOADING........</h1>
        </div>
      </>
    );
  }
};

export default EventPage;
