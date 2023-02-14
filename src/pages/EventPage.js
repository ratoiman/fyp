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
import { isMobile } from "react-device-detect";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import CardContent from "@mui/joy/CardContent";
import CardCover from "@mui/joy/CardCover";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {
  event_page_card_mobile,
  event_page_card_desktop,
} from "../ui_styles/MuiStyles";

const EventPage = (props) => {
  const { user } = useUserAuth();

  const [eventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceType, setDeviceType] = useState("desktop");

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
      // <Container className="card mt-5 w-100 p-4 bg-black">
      //   <div className="text-white">Title: {eventData["details"].title}</div>
      //   <div className="text-white">
      //     Subtitle: {eventData["details"].subtitle}
      //   </div>
      //   <div className="text-white">
      //     Start Date: {eventData["details"].start_date}
      //   </div>
      //   <div className="text-white">
      //     Start Time: {eventData["details"].start_time}
      //   </div>
      //   <div className="text-white">
      //     End Date: {eventData["details"].end_date}
      //   </div>
      //   <div className="text-white">
      //     End Time: {eventData["details"].end_time}
      //   </div>
      //   <div className="text-white">
      //     Description: {eventData["details"].description}
      //   </div>

      //   ACTIVITIES
      //   <div className="text-white">
      //     {eventData["activities"].map((activity) => {

      //       return (
      //         <>
      //           <div>Title: {activity.title}</div>
      //         </>
      //       );
      //     })}
      //   </div>
      // </Container>
      <>
        <Box className="event-card">
          <Card
            variant="outlined"
            sx={isMobile ? event_page_card_mobile : event_page_card_desktop}
          >
            <CardOverflow sx={{ maxHeight: "8%" }}>
              <AspectRatio ratio="2">
                <img
                  style={{ maxHeight: "25%" }}
                  src="https://c4.wallpaperflare.com/wallpaper/955/69/70/minimalism-space-stars-wallpaper-preview.jpg"
                  // srcSet="https://images.unsplash.com/photo-1542773998-9325f0a098d7?auto=format&fit=crop&w=320&dpr=2 2x"
                  loading="lazy"
                  alt="BANNER"
                />
              </AspectRatio>
            </CardOverflow>
            <Box className="mt-2">
              <h1>{eventData["details"].title}</h1>
              <h3>Subtitle: {eventData["details"].subtitle}</h3>
              <h5>From: {eventData["details"].start_date}</h5>
              <h5>at: {eventData["details"].start_time}</h5>
              <h1></h1>
              <h5>Until: {eventData["details"].end_date}</h5>
              <h5>at: {eventData["details"].end_time}</h5>

              <h2> Event details </h2>
              <h6>{eventData["details"].description}</h6>

              <h2> Activities </h2>
              <ul>
                {eventData["activities"].map((activity) => {
                  return (
                    <>
                      <li>{activity.title} </li>
                    </>
                  );
                })}
              </ul>
            </Box>
          </Card>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <div>
          {" "}
          <h1 style={{ color: "#DAA520" }}> LOADING........</h1>
        </div>
      </>
    );
  }
};

export default EventPage;
