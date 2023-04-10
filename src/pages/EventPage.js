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
  socialMediaButtonTheme,
  event_page_social_media_button,
  event_page_social_media_box,
  event_page_social_media_button_mobile,
} from "../ui_styles/MuiStyles";
import {
  event_page_card_title_box,
  event_page_card_dates_box,
} from "../ui_styles/MuiStyles";
import EventPageActivityCard from "../components/EventPageActivityCard";
import { ThemeProvider } from "@mui/material/styles";
import { editButtonStyle, submitButtonTheme } from "../ui_styles/MuiStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import IconButton from "@mui/material/IconButton";
import EventPageLocation from "../components/EventPageLocation";
import { Tiktok } from "react-bootstrap-icons";
import { Instagram } from "react-bootstrap-icons";
import { Facebook } from "react-bootstrap-icons";
import { Twitter } from "react-bootstrap-icons";
import { Link, Stack } from "@mui/material";
import { RichTextDisplay } from "../components/RichTextEditor";
const EventPage = (props) => {

  const [eventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateSet, setStartDateSet] = useState([]);
  const [displayActivities, setDisplayActivities] = useState(true);
  const [displaySocialLinks, setDisplaySocialLinks] = useState(true);

  const [instaProfile, setInstaProfile] = useState("");
  const [tiktokProfile, setTiktokProfile] = useState("");
  const [twitterProfile, setTwitterProfile] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [socialMediaPresent, setSocialMediaPresent] = useState(false);

  const facebookLink = "https://www.facebook.com/";
  const instaLink = "https://www.instagram.com/";
  const tiktokLink = "https://www.tiktok.com/";
  const twitterLink = "https://www.twitter.com/";

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

  const setSocialMediaProfiles = () => {
    if (!isLoading) {
      if (
        eventData["details"].instagram &&
        eventData["details"].instagram !== undefined &&
        eventData["details"].instagram !== ""
      ) {
        setInstaProfile(
          eventData["details"].instagram.match(
            /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/
          )[1]
        );
      }

      if (
        eventData["details"].tiktok &&
        eventData["details"].tiktok !== undefined &&
        eventData["details"].tiktok !== ""
      ) {
        setTiktokProfile(
          eventData["details"].tiktok.match(
            /(?:(?:http|https):\/\/)?(?:www.)?(?:tiktok.com)\/(@\w+)/
          )[1]
        );
      }

      if (
        eventData["details"].twitter &&
        eventData["details"].twitter !== undefined &&
        eventData["details"].twitter !== ""
      ) {
        setTwitterProfile(
          eventData["details"].twitter.match(
            /(?:(?:http|https):\/\/)?(?:www.)?(?:twitter.com)\/(\w+)/
          )[1]
        );
      }

      if (
        eventData["details"].facebook &&
        eventData["details"].facebook !== undefined &&
        eventData["details"].facebook !== ""
      ) {
        setFacebookProfile(
          eventData["details"].facebook.match(
            /(?:(?:http|https):\/\/)?(?:www.)?(?:facebook.com)\/(\w+.+)/
          )[1]
        );
      }
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

  useEffect(() => {
    setSocialMediaProfiles();
  }, [eventData, isLoading]);

  useEffect(() => {
    if (
      instaProfile !== "" ||
      tiktokProfile !== "" ||
      twitterProfile !== "" ||
      facebookProfile !== ""
    ) {
      setSocialMediaPresent(true);
    } else {
      setSocialMediaPresent(false);
    }
  }, [instaProfile, tiktokProfile, twitterProfile, facebookProfile]);

  const DisplayDates = () => {
    if (startDate === endDate) {
      return (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Stack direction="row" spacing={1} marginRight={1}>
              <Typography variant="h6" color="white">
                {startDate}
              </Typography>
              <Typography variant="h6" color="#DAA520">
                {eventData["details"].start_time}
              </Typography>
              <Typography
                color="#DAA520"
                variant="h6"
                display={
                  eventData["details"].end_time !== undefined &&
                  eventData["details"].end_time !== ""
                    ? ""
                    : "none"
                }
              >
                -
              </Typography>
              <Typography variant="h6" color="#DAA520">
                {eventData["details"].end_time}
              </Typography>
            </Stack>
          </Box>
        </>
      );
    } else {
      if (isMobile) {
        return (
          <>
            <Stack
              direction="column"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Typography variant="h6" color="white">
                  {startDate}
                </Typography>
                <Typography variant="h6" color="#DAA520">
                  {eventData["details"].start_time}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Typography variant="h6" color="white">
                  {endDate}
                </Typography>{" "}
                <Typography variant="h6" color="#DAA520">
                  {eventData["details"].end_time}
                </Typography>
              </Stack>
            </Stack>
          </>
        );
      } else {
        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Stack direction="row" spacing={1} marginRight={1}>
                <Typography variant="h6" color="white">
                  {startDate}
                </Typography>
                <Typography variant="h6" color="#DAA520">
                  {eventData["details"].start_time}
                </Typography>
              </Stack>
              <Typography
                variant="h6"
                color="#DAA520"
                display={
                  eventData["details"].end_time !== undefined &&
                  eventData["details"].end_time !== ""
                    ? ""
                    : "none"
                }
              >
                -
              </Typography>
              <Stack direction="row" spacing={1} marginLeft={1}>
                <Typography variant="h6" color="#DAA520">
                  {eventData["details"].end_time}
                </Typography>
                <Typography variant="h6" color="white">
                  {endDate}
                </Typography>
              </Stack>
            </Box>
          </>
        );
      }
    }
  };

  if (!isLoading) {
    return (
      <>
        <Box className={isMobile ? "event-page-mobile" : "event-page-card"}>
          <Card
            variant="outlined"
            sx={isMobile ? event_page_card_mobile : event_page_card_desktop}
          >
            <Box className="close-button">
              <IconButton
                aria-label="close"
                size="small"
                onClick={() => {
                  props.refreshSearch();
                  props.closeEvent();
                }}
              >
                {/* using same style as edit button, no need to create new style */}
                <CloseOutlinedIcon sx={editButtonStyle} />
              </IconButton>
            </Box>
            <CardContent>
              <Box color="white" className="" >
                <Box sx={event_page_card_title_box}>
                  <Box className="">
                    <Typography textAlign="center" variant="h4">
                      {eventData["details"].title}
                    </Typography>
                  </Box>
                  <Box className="" sx={{ marginLeft: 3, marginBottom:2, marginTop:1 }}>
                    <Typography variant="subtitle1">
                      {eventData["details"].subtitle}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={event_page_card_dates_box}>
                  <DisplayDates />
                </Box>

                <EventPageLocation
                  locationType={eventData["details"].location_type}
                  locationDisplayName={
                    eventData["details"].location_display_name
                  }
                  locationString={eventData["details"].location_string}
                  meetLink={eventData["details"].meet_link}
                  marker={eventData["details"].marker}
                />

                <Typography
                  variant="h5"
                  marginTop={4}
                  marginLeft={isMobile ? 1.5 : 3}
                  marginBottom={3}
                >
                  Details{" "}
                </Typography>

                <Box
                  sx={
                    isMobile
                      ? {
                          borderStyle: "solid",
                          borderColor: "#daa520",
                          borderWidth: "1px",
                          borderRadius: "10px",
                          // marginLeft: 3,
                          // marginRight: 3,
                        }
                      : {
                          borderStyle: "solid",
                          borderColor: "#daa520",
                          borderWidth: "1px",
                          borderRadius: "10px",
                          marginLeft: 3,
                          marginRight: 3,
                        }
                  }
                >
                  <RichTextDisplay
                    description={eventData["details"].description}
                  />
                </Box>
                <Box
                  sx={event_page_social_media_box}
                  display={socialMediaPresent ? "" : "none"}
                >
                  <Stack direction="row" marginTop={4}>
                    <Typography
                      variant="h5"
                      color="white"
                      marginLeft={isMobile ? 0 : 1.5}
                    >
                      Social media
                    </Typography>
                    <ThemeProvider theme={socialMediaButtonTheme}>
                      <Button
                        size="large"
                        startIcon={
                          displaySocialLinks === false ? (
                            <ExpandMoreIcon />
                          ) : (
                            <ExpandLessIcon />
                          )
                        }
                        onClick={() =>
                          setDisplaySocialLinks(!displaySocialLinks)
                        }
                      />
                    </ThemeProvider>
                  </Stack>

                  {/* Social Media links */}
                  {isMobile ? (
                    <Stack
                      direction="column"
                      spacing={2}
                      marginTop={1.5}
                      display={displaySocialLinks ? "" : "none"}
                    >
                      {/* <Box display={displaySocialLinks ? "" : "none"}> */}
                      <ThemeProvider theme={socialMediaButtonTheme}>
                        {/* Insta */}
                        <Link
                          display={
                            eventData["details"].instagram !== "" &&
                            eventData["details"].instagram !== undefined
                              ? ""
                              : "none"
                          }
                          target="_blank"
                          href={instaLink + instaProfile}
                          rel="noreffer"
                          underline="none"
                          sx={
                            isMobile
                              ? event_page_social_media_button_mobile
                              : event_page_social_media_button
                          }
                        >
                          <Button
                            startIcon={<Instagram />}
                            color="primary"
                            variant="text"
                            sx={{ width: "100%" }}
                            // onClick={() => console.log(eventData["details"].instagram)}
                          >
                            {instaProfile}
                          </Button>
                        </Link>

                        {/* TikTok */}
                        <Link
                          display={
                            eventData["details"].tiktok !== "" &&
                            eventData["details"].tiktok !== undefined
                              ? ""
                              : "none"
                          }
                          target="_blank"
                          href={tiktokLink + tiktokProfile}
                          rel="noreffer"
                          underline="none"
                          sx={
                            isMobile
                              ? event_page_social_media_button_mobile
                              : event_page_social_media_button
                          }
                        >
                          <Button
                            startIcon={<Tiktok />}
                            color="primary"
                            variant="text"
                            sx={{ width: "100%" }}
                          >
                            {tiktokProfile}
                          </Button>
                        </Link>

                        {/* Twitter */}
                        <Link
                          display={
                            eventData["details"].twitter !== "" &&
                            eventData["details"].twitter !== undefined
                              ? ""
                              : "none"
                          }
                          target="_blank"
                          href={twitterLink + twitterProfile}
                          rel="noreffer"
                          underline="none"
                          sx={
                            isMobile
                              ? event_page_social_media_button_mobile
                              : event_page_social_media_button
                          }
                        >
                          <Button
                            startIcon={<Twitter />}
                            color="primary"
                            variant="text"
                            sx={{ width: "100%" }}
                          >
                            {twitterProfile}
                          </Button>
                        </Link>

                        {/* Facebook */}
                        <Link
                          display={
                            eventData["details"].facebook !== "" &&
                            eventData["details"].facebook !== undefined
                              ? ""
                              : "none"
                          }
                          target="_blank"
                          href={facebookLink + facebookProfile}
                          rel="noreffer"
                          underline="none"
                          sx={
                            isMobile
                              ? event_page_social_media_button_mobile
                              : event_page_social_media_button
                          }
                        >
                          <Button
                            startIcon={<Facebook />}
                            color="primary"
                            variant="text"
                            sx={{ width: "100%" }}
                          >
                            {facebookProfile}
                          </Button>
                        </Link>
                      </ThemeProvider>
                    </Stack>
                  ) : (
                    <Stack
                      direction="row"
                      spacing={3}
                      marginTop={1.5}
                      display={displaySocialLinks ? "" : "none"}
                    >
                      <ThemeProvider theme={socialMediaButtonTheme}>
                        {/* Insta */}
                        <Link
                          display={
                            eventData["details"].instagram !== "" &&
                            eventData["details"].instagram !== undefined
                              ? ""
                              : "none"
                          }
                          target="_blank"
                          href={instaLink + instaProfile}
                          rel="noreffer"
                          underline="none"
                          sx={
                            isMobile
                              ? event_page_social_media_button
                              : event_page_social_media_button
                          }
                        >
                          <Button
                            startIcon={<Instagram />}
                            color="primary"
                            variant="text"
                            sx={{ width: "100%" }}
                            // onClick={() => console.log(eventData["details"].instagram)}
                          >
                            {instaProfile}
                          </Button>
                        </Link>

                        {/* TikTok */}
                        <Link
                          display={
                            eventData["details"].tiktok !== "" &&
                            eventData["details"].tiktok !== undefined
                              ? ""
                              : "none"
                          }
                          target="_blank"
                          href={tiktokLink + tiktokProfile}
                          rel="noreffer"
                          underline="none"
                          sx={
                            isMobile
                              ? event_page_social_media_button
                              : event_page_social_media_button
                          }
                        >
                          <Button
                            startIcon={<Tiktok />}
                            color="primary"
                            variant="text"
                            sx={{ width: "100%" }}
                          >
                            {tiktokProfile}
                          </Button>
                        </Link>

                        {/* Twitter */}
                        <Link
                          display={
                            eventData["details"].twitter !== "" &&
                            eventData["details"].twitter !== undefined
                              ? ""
                              : "none"
                          }
                          target="_blank"
                          href={twitterLink + twitterProfile}
                          rel="noreffer"
                          underline="none"
                          sx={
                            isMobile
                              ? event_page_social_media_button
                              : event_page_social_media_button
                          }
                        >
                          <Button
                            startIcon={<Twitter />}
                            color="primary"
                            variant="text"
                            sx={{ width: "100%" }}
                          >
                            {twitterProfile}
                          </Button>
                        </Link>

                        {/* Facebook */}
                        <Link
                          display={
                            eventData["details"].facebook !== "" &&
                            eventData["details"].facebook !== undefined
                              ? ""
                              : "none"
                          }
                          target="_blank"
                          href={facebookLink + facebookProfile}
                          rel="noreffer"
                          underline="none"
                          sx={
                            isMobile
                              ? event_page_social_media_button
                              : event_page_social_media_button
                          }
                        >
                          <Button
                            startIcon={<Facebook />}
                            color="primary"
                            variant="text"
                            sx={{ width: "100%" }}
                          >
                            {facebookProfile}
                          </Button>
                        </Link>
                      </ThemeProvider>
                    </Stack>
                  )}
                </Box>

                <Box className="" marginTop={4}>
                  <Typography
                    marginLeft={3}
                    className="mb-2"
                    variant="h5"
                    display={eventData["activities"].length === 0 ? "none" : ""}
                  >
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
                  <Box
                    display={displayActivities === true ? "" : "none"}
                  >
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
