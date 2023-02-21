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
} from "firebase/firestore";
import Loading from "../components/Loading";
import EventPage from "./EventPage";
import EventCard2 from "../components/EventCard2";
import { getUserEventsDetails, getUserEvents } from "../context/DbCallsContext";

const MyEvents = () => {
  // eslint-disable-next-line
  const [userEvents, setUserEvents] = useState(new Set());
  const [userEventsDetails, setUserEventsDetails] = useState([]);
  const [adminEventsDetails, setAdminEventsDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventPageLoad, setEventPageLoad] = useState(false);
  const [selectedEventID, setSelectedEventID] = useState(null);

  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const loading = () => {
    // console.log(userEventsDetails);
    if (userEventsDetails.length > 0 || adminEventsDetails.length > 0) {
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

  useEffect(() => {
    if (user !== null) {
      if (Object.keys(user).length !== 0) {

        onSnapshot(collection(db, "users", user.uid, "events"), (snap) => {
        console.log('on snap')
          setUserEvents(
            snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
          // getUserEvents(user, db, setIsLoading, setUserEvents);
        });
      }
    }
  }, [user]);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      onSnapshot(collection(db, "users", user.uid, "events"), (snap) => {
        console.log("before details ", userEvents)
        getUserEventsDetails(
          db,
          userEvents,
          userEventsDetails,
          adminEventsDetails,
          setUserEventsDetails,
          setAdminEventsDetails
        );
      });
    }
  }, [userEvents]);

  useEffect(() => {
    loading();
  }, [userEventsDetails, adminEventsDetails]);

  // return (
  //   <>
  //     <div className="p-4 box mt-3 text-center">
  //     <Box sx={{ width: '100%', maxWidth: 500 }}>
  //     <Typography variant="h6">Welcome </Typography><br />
  //       {/* {user && user.email} */}
  //      <Typography variant="h5"> {currentUser}
  //      </Typography>
  //      </Box>
  //     </div>
  //     <Container className="login-container">
  //       <div className="d-grid gap-2">
  //         <Button variant="primary" onClick={handleLogout}>
  //           Log out
  //         </Button>
  //         <Button variant="primary" onClick={handleLanding}>
  //           Landing Page
  //         </Button>

  //         <Button variant="primary" onClick={handleCreateEvent}>
  //           Create Event
  //         </Button>
  //       </div>
  //     </Container>
  //   </>
  // );

  // console.log("events ", adminEventsDetails);

  // console.log("events details ", userEventsDetails);

  if (eventPageLoad === false) {
    if (!isLoading) {
      if (userEventsDetails.length > 0 || adminEventsDetails.length > 0) {
        return (
          <>
            <Box
              sx={{
                mt: 7,
                display: "flex",
                justifyContent: "center",
                mr: "20%",
              }}
            >
              <Stack direction="column" spacing={3}>
                <Box>
                  <Typography variant="h3" textAlign="center">
                    My events
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6">Welcome </Typography>
                  <br />
                  {/* {user && user.email} */}
                  <Typography variant="h5"> {user.displayName}</Typography>
                </Box>

                <Box
                  sx={{ justifyContent: "center", backgroundColor: "black" }}
                >
                  <Stack
                    direction="column"
                    sx={{ justifyContent: "center", display: "flex" }}
                  >
                    <Box>
                      <Typography> Administrated events </Typography>
                    </Box>

                    <Box>
                      {adminEventsDetails.map((eventDetails) => {
                        // console.log("ad ", adminEventsDetails);
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
                            activities={eventDetails["activities"]}
                            usersList={eventDetails["users"]}
                            userEvents={userEvents}
                            eventID={eventDetails.id}
                            handleEventLink={(id) => {
                              handleEventLink(id);
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Stack>
                </Box>

                <Box
                  sx={{ justifyContent: "center", backgroundColor: "black" }}
                >
                  <Stack
                    direction="column"
                    sx={{ justifyContent: "center", display: "flex" }}
                  >
                    <Box>
                      <Typography> Guest events </Typography>
                    </Box>

                    <Box>
                      {userEventsDetails.map((eventDetails) => {
                        // console.log("ud ", userEventsDetails);
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
                            activities={eventDetails["activities"]}
                            userEvents={userEvents}
                            usersList={eventDetails["users"]}
                            eventID={eventDetails.id}
                            handleEventLink={(id) => {
                              handleEventLink(id);
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Stack>
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
          <Loading />;
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
};

export default MyEvents;
