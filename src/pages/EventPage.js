import React, { useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import Button from "@mui/material/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/joy/Box";
import Loading from "../components/Loading";
import {
  event_page_card_mobile,
  event_page_card_desktop,
} from "../ui_styles/MuiStyles";
import {
  event_page_card_title_box,
  event_page_card_dates_box,
} from "../ui_styles/MuiStyles";
import EventPageActivityCard from "../components/EventPageActivityCard";
import {  ThemeProvider } from "@mui/material/styles";
import { editButtonStyle, submitButtonTheme } from "../ui_styles/MuiStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import IconButton from "@mui/material/IconButton";

const EventPage = (props) => {
  const { user } = useUserAuth();

  const [eventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateSet, setStartDateSet] = useState([]);
  const [displayActivities, setDisplayActivities] = useState(true);

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

  const getDates = () => {
    if (!isLoading) {
      if (eventData["details"].end_date === null) {
        eventData["details"].end_date = "";
      }
      const startDateArray = eventData["details"].start_date.split("/");
      const endDateArray = eventData["details"].end_date.split("/");
      let sd =
        eventData["details"].start_date_day +
        " " +
        startDateArray[0] +
        " " +
        eventData["details"].start_date_month;

      let ed =
        eventData["details"].end_date_day +
        " " +
        endDateArray[0] +
        " " +
        eventData["details"].end_date_month;

      setStartDate(sd);
      setEndDate(ed);
    }
  };

  const getActivitiesDateRange = () => {
    if (eventData["activities"]) {
      eventData["activities"].map((activity) => {
        let startDateArray = activity.start_date.split("/");
        const sd = new Date(
          startDateArray[2] + "-" + startDateArray[1] + "-" + startDateArray[0]
        ).toString();
        setStartDateSet((prev) => [...new Set([...prev, sd])]);
      });
    }
  };

  useEffect(() => {
    getEventsDetails();
  }, []);

  useEffect(() => {
    getDates();
  }, [eventData, isLoading]);

  useEffect(() => {
    if (eventData.length !== 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [eventData]);

  useEffect(() => {
    getActivitiesDateRange();
  }, [eventData, isLoading]);

  if (!isLoading) {
    return (
      <>
        <Box className={isMobile ? "event-card-mobile" : "event-page-card"}>
          <Card
            variant="outlined"
            sx={isMobile ? event_page_card_mobile : event_page_card_desktop}
          >
            <div className="close-button">
              <IconButton
                aria-label="close"
                size="small"
                onClick={() => {
                  props.closeEvent();
                }}
              >
                {/* using same style as edit button, no need to create new style */}
                <CloseOutlinedIcon sx={editButtonStyle} />
              </IconButton>
            </div>
            <CardContent>
              <Box color="white" className="">
                <Box className="w-100" sx={event_page_card_title_box}>
                  <Box className="">
                    <Typography  textAlign="center" variant="h4">
                      {eventData["details"].title}
                    </Typography>
                  </Box>
                  <Box className="mt-2">
                    <Typography variant="subtitle2">
                      {eventData["details"].subtitle}
                    </Typography>
                  </Box>
                </Box>
                <h1></h1>
                <Box className="w-100" sx={event_page_card_dates_box}>
                  <Typography variant="h6">
                    Starts: {startDate} {eventData["details"].start_time}
                  </Typography>

                  <Typography variant="h6">
                    Ends: {endDate} {eventData["details"].end_time}
                  </Typography>
                </Box>

                <Typography variant="h5">
                  <br />
                  Details{" "}
                </Typography>
                <Typography variant="h6">
                  {eventData["details"].description}
                </Typography>

                <Box className="mt-4">
                  <Typography className="mb-2" variant="h5">
                    {" "}
                    What's on?{" "}
                    <ThemeProvider theme={submitButtonTheme}>
                      <Button
                        size="large"
                        startIcon={
                          displayActivities === false ? (
                            <ExpandMoreIcon />
                          ) : (
                            <ExpandLessIcon />
                          )
                        }
                        onClick={() => setDisplayActivities(!displayActivities)}
                      />
                      {/* See
                      </Button> */}
                    </ThemeProvider>
                  </Typography>
                  <Box display={displayActivities === true ? "" : "none"}>
                    {startDateSet.map((sd) => {
                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <div className="date-line" />

                            <div>
                              {/* <Typography sx={{textAlign:"center"}} variant="h6" className="mb-1 mt-4"> */}
                              <p>
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    color: "#DAA520",
                                  }}
                                  variant="h6"
                                  className="mx-1 mb-1 mt-2"
                                >
                                  {sd.split(" ")[0] +
                                    " " +
                                    sd.split(" ")[2] +
                                    " " +
                                    sd.split(" ")[1]}
                                </Typography>
                              </p>
                            </div>

                            <div className="date-line" />
                          </div>
                          {eventData["activities"].map((activity) => {
                            if (
                              activity.start_date_day === sd.split(" ")[0] &&
                              activity.start_date.split("/")[0].toString() ===
                                sd.split(" ")[2] &&
                              activity.start_date_month === sd.split(" ")[1]
                            ) {
                              return (
                                <>
                                  <Box className="mb-2" key={activity}>
                                    <EventPageActivityCard
                                      activity={activity}
                                    />
                                  </Box>
                                </>
                              );
                            }
                          })}
                        </>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box sx={{ justifyContent: "center", marginLeft: "20%" }}>
          <Loading />
        </Box>
      </>
    );
  }
};

export default EventPage;
