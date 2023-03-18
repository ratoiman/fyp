import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  StyledTextField,
  pickerStyle,
  popupStyle,
  popupStyleMobile,
  submitButtonTheme,
  new_event_menu_item_style,
  deleteLocationStyle3,
  editButtonStyle,
} from "../ui_styles/MuiStyles";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import AddNewActivity from "./AddNewActivity";
import NewEventActivityCard from "./NewEventActivityCard";
import { isMobile } from "react-device-detect";
import { ThemeProvider } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import GoogleMapsIntegration from "./GoogleMapsIntegration";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { IconButton, Stack, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddSocialMediaLinks from "./AddSocialMediaLinks";
import AddSocialMediaLinkPopover from "./AddSocialMediaLinkPopover";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PlacesAutocomplete from "./PlacesAutocomplete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PrivacySettingConfigPopover from "./PrivacySettingConfigPopover";

const EditEvent = (props) => {
  // const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [showEndDate, setShowEndDate] = useState("");
  const [expandDate, setExpandDate] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [inversedCurrentDate, setInversedCurrentDate] = useState(""); // MM/DD/YYYY to use as minDate bound in <DatePicker startDate>
  const [currentTime, setCurrentTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formattedStartTime, setFormattedStartTime] = useState("");
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");

  // store data from the latest new activity (in case user didn't finish editing, so nothing will be lost)
  const [newActivityPopout, setNewActivityPopout] = useState(false);
  const [activityID, setActivityID] = useState(null);
  const [activityTitle, setActivityTitle] = useState(null);
  const [activityStartDate, setActivityStartDate] = useState("");
  const [activityStartTime, setActivityStartTime] = useState("");
  const [activityEndDate, setActivityEndDate] = useState("");
  const [activityEndTime, setActivityEndTime] = useState("");
  const [activityDescription, setActivityDescription] = useState(null);
  const [activityExpandDate, setActivityExpandDate] = useState(false);
  const [activityShowEndDate, setActivityShowEndDate] = useState("d-none");

  const [activityLocationType, setActivityLocationType] = useState("");
  const [activityLocationString, setActivityLocationString] = useState("");
  const [activityLocationDisplayName, setActivityLocationDisplayName] =
    useState("");
  const [activityMarker, setActivityMarker] = useState("");
  const [activityMeetLink, setActivityMeetLink] = useState("");

  const [activities, setActivities] = useState([]);
  const [displayActivities, setDisplayActivities] = useState(true);
  const [displaySocialLinks, setDisplaySocialLinks] = useState(false);

  // States to use when editing an activity, to avoid overwritting an unfinished activity
  const [editActivityPopout, setEditActivityPopout] = useState(false);
  const [editActivityID, setEditActivityID] = useState(null);
  const [editActivityTitle, setEditActivityTitle] = useState(null);
  const [editActivityStartDate, setEditActivityStartDate] = useState("");
  const [editActivityStartTime, setEditActivityStartTime] = useState("");
  const [editActivityEndDate, setEditActivityEndDate] = useState("");
  const [editActivityEndTime, setEditActivityEndTime] = useState("");
  const [editActivityDescription, setEditActivityDescription] = useState(null);
  const [editActivityExpandDate, setEditActivityExpandDate] = useState(false);
  const [editActivityShowEndDate, setEditActivityShowEndDate] =
    useState("d-none");
  const [editActivityLocationType, setEditActivityLocationType] = useState("");
  const [editActivityLocationString, setEditActivityLocationString] =
    useState("");
  const [editActivityLocationDisplayName, setEditActivityLocationDisplayName] =
    useState("");
  const [editActivityMarker, setEditActivityMarker] = useState("");
  const [editActivityMeetLink, setEditActivityMeetLink] = useState("");

  // error and validation handling

  const [showError, setShowError] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const titleErrorMessage = "Title can't be empty";

  const [descriptionError, setDescriptionError] = useState(false);
  const descriptionErrorMessage = "Description can't be empty";

  const [startDateError, setStartDateError] = useState(false);
  const [startDateErrorMessage, setStartDateErrorMessage] = useState("");

  const [startTimeError, setStartTimeError] = useState(false);
  const [startTimeErrorMessage, setStartTimeErrorMessage] = useState(false);

  const [endDateError, setEndDateError] = useState(false);
  const [endDateErrorMessage, setEndDateErrorMessage] = useState("");

  const [endTimeError, setEndTimeError] = useState(false);
  const [endTimeErrorMessage, setEndTimeErrorMessage] = useState(false);

  // Privacy and categories
  const [visibility, setVisibility] = useState("Public");
  const [category, setCategory] = useState("Category");
  const categories = ["Music", "Improv", "Sports", "Drama", "Party", "General"];
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  // Privacy settings
  const [joinCode, setJoinCode] = useState("");
  const [joinByCodeOpen, setJoinByCodeOpen] = useState(false);
  const [isPrivacyConfigured, setIsPrivacyConfigured] = useState(false);
  const [configurePrivacyPopout, setConfigurePrivacyPopout] = useState(false);

  // Location and location type
  const [locationType, setLocationType] = useState("in person");
  const [locationTypeAnchor, setLocationTypeAnchor] = useState(null);
  const [locationTypeOpen, setLocationTypeOpen] = useState(false);
  const [locationString, setLocationString] = useState("");
  const [displayLocation, setDisplayLocation] = useState(true);
  const [marker, setMarker] = useState("");
  const [locationDisplayName, setLocationDisplayName] = useState("");
  const [meetLink, setMeetLink] = useState("");

  // Social media links
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [platform, setPlatform] = useState("");
  const [currentProfile, setCurrentProfile] = useState("");

  // Event details

  let isDateAndTimeValid = false;

  const { user } = useUserAuth();
  const today = new Date();

  //   Setting states using data passed from parent. props.eventDetails contains everything
  const getEventDetails = () => {
    // console.log(props.eventDetails["details"])
    const changeDateFormat = (date) => {
      if (date) {
        const arr = date.split("/");
        let newDate = arr[1] + "/" + arr[0] + "/" + arr[2];

        if (newDate === null) {
          return "";
        }
        return newDate;
      } else {
        return "";
      }
    };

    setTitle(props.eventDetails["details"].title);
    setSubtitle(props.eventDetails["details"].subtitle);
    setStartDate(changeDateFormat(props.eventDetails["details"].start_date));
    if (
      props.eventDetails["details"].start_time !== undefined &&
      props.eventDetails["details"].start_time !== null &&
      props.eventDetails["details"].start_time !== ""
    ) {
      setStartTime(
        `Tue Mar 14 2023 ${props.eventDetails["details"].start_time}:00 GMT+0000 (Greenwich Mean Time)`
      );
    } else {
      setStartTime("");
    }
    setEndDate(changeDateFormat(props.eventDetails["details"].end_date));
    if (
      props.eventDetails["details"].end_time !== undefined &&
      props.eventDetails["details"].end_time !== null &&
      props.eventDetails["details"].end_time !== ""
    ) {
      console.log("set", props.eventDetails["details"].end_time);
      setEndTime(
        `Tue Mar 14 2023 ${props.eventDetails["details"].end_time}:00 GMT+0000 (Greenwich Mean Time)`
      );
    } else {
      setEndTime("");
    }
    console.log("editing....", props.eventDetails);
    setVisibility(props.eventDetails["details"].privacy);
    setCategory(props.eventDetails["details"].category);
    setLocationType(props.eventDetails["details"].location_type);
    setLocationString(props.eventDetails["details"].location_string);
    setLocationDisplayName(props.eventDetails["details"].location_display_name);
    setMarker(props.eventDetails["details"].marker);
    setMeetLink(props.eventDetails["details"].meet_link);
    setActivities(props.eventDetails["activities"]);
    setDescription(props.eventDetails["details"].description);
    setInstagram(props.eventDetails["details"].instagram);
    setTiktok(props.eventDetails["details"].tiktok);
    setFacebook(props.eventDetails["details"].facebook);
    setTwitter(props.eventDetails["details"].twitter);
    setJoinCode(props.eventDetails["details"].join_code);
    if (
      props.eventDetails["details"].join_code !== "" &&
      props.eventDetails["details"].join_code !== undefined &&
      props.eventDetails["details"].join_code !== null &&
      props.eventDetails["details"].privacy === "Private"
    ) {
      setJoinByCodeOpen(true);
    }
    // console.log(props.eventDetails["activities"]);
  };

  const formatDate = (date, setter, format) => {
    let formatted = "";
    if (date) {
      if (typeof date === "string") {
        if (format === "DD/MM/YYYY") {
          formatted =
            date.split("/")[1] +
            "/" +
            date.split("/")[0] +
            "/" +
            date.split("/")[2];
        } else {
          formatted = date;
        }
      } else {
        const day = date.toDate().getDate().toString();
        const month = (date.toDate().getMonth() + 1).toString();
        const year = date.toDate().getFullYear().toString();

        if (format === "DD/MM/YYYY") {
          formatted =
            day.padStart(2, "0") + "/" + month.padStart(2, "0") + "/" + year;
        }

        if (format === "MM/DD/YYYY") {
          formatted =
            month.padStart(2, "0") + "/" + day.padStart(2, "0") + "/" + year;
        }
      }
    }

    setter(formatted);
  };

  const formatTime = (time, setter) => {
    if (time) {
      if (typeof time === "string") {
        setter(
          time.split(" ")[4].split(":")[0] +
            ":" +
            time.split(" ")[4].split(":")[1]
        );
      } else {
        const hours = time.toDate().getHours().toString();
        const minutes = time.toDate().getMinutes().toString();

        setter(hours.padStart(2, "0") + ":" + minutes.padStart(2, "0"));
      }
    }
  };

  // Get current date and time for date range validation
  const getCurrentDate = () => {
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString();
    const day = today.getDate().toString();
    const hours = today.getHours().toString();
    const minutes = today.getMinutes().toString();

    setCurrentDate(
      day.padStart(2, "0") + "/" + month.padStart(2, "0") + "/" + year
    );
    setInversedCurrentDate(
      month.padStart(2, "0") + "/" + day.padStart(2, "0") + "/" + year
    );
    setCurrentTime(hours.padStart(2, "0") + ":" + minutes.padStart(2, "0"));
  };

  const showDate = () => {
    if (showEndDate === "") {
      setShowEndDate("d-none");
    } else {
      setShowEndDate("");
    }
  };

  const checkDateAndTime = () => {
    isDateAndTimeValid = true;

    if (startDate === null || startDate === "") {
      isDateAndTimeValid = false;
      setStartDateError(true);
      setStartDateErrorMessage("Please select a start date");
    }

    if (formattedStartDate < currentDate) {
      isDateAndTimeValid = false;
      setStartDateError(true);
      setStartDateErrorMessage("Start date can't be in the past");
    }

    if (formattedStartTime) {
      if (
        formattedStartTime < currentTime &&
        formattedStartDate === currentDate
      ) {
        isDateAndTimeValid = false;
        setStartTimeError(true);
        setStartTimeErrorMessage("Start time can't be in the past");
      }
    }

    if (formattedEndDate) {
      if (formattedEndDate < formattedStartDate) {
        isDateAndTimeValid = false;
        setEndDateError(true);
        setEndDateErrorMessage("End date can't be before start date");
      }
    }

    if (!formattedEndDate && formattedEndTime) {
      console.log("Ed ", formattedEndDate, formattedEndTime);
      isDateAndTimeValid = false;
      setEndDateError(true);
      setEndDateErrorMessage("Please, select a valid end date");
    }

    if (
      formattedEndDate === formattedStartDate &&
      formattedStartTime &&
      formattedEndTime &&
      formattedEndTime < formattedStartTime
    ) {
      isDateAndTimeValid = false;
      setEndTimeError(true);
      setEndTimeErrorMessage("End time can't be before start time");
    }

    if (isDateAndTimeValid) {
      setStartDateErrorMessage("");
      setStartTimeErrorMessage("");
      setEndDateErrorMessage("");
      setEndTimeErrorMessage("");
      setStartDateError(false);
      setStartTimeError(false);
      setEndDateError(false);
      setEndTimeError(false);
    } else {
      isDateAndTimeValid = false;
    }
  };

  const checkField = (field, errorSetter) => {
    if (field === null || field === "") {
      errorSetter(true);
    } else {
      errorSetter(false);
    }
  };

  // Checking if all online activities have the correct location
  const checkLocation = () => {
    // Checking if all activities that have location as "Same as event" have accurate locations
    activities.map((activity) => {
      if (activity.locationType === "Same as event") {
        if (locationType === "Online") {
          activity.locationString = "";
          activity.marker = "";
          activity.locationDisplayName = "";
          activity.meetLink = meetLink;
        } else {
          activity.locationString = locationString;
          activity.marker = marker;
          activity.locationDisplayName = locationDisplayName;
          activity.meetLink = "";
        }
      }

      // Checking if all online activities have the correct location
      if (activity.locationType === "Online") {
        activity.locationString = "";
        activity.marker = "";
        activity.locationDisplayName = "";
      }
    });

    // Checking if event location corresponds with location type
    if (locationType === "Online") {
      setLocationString("");
      setMarker("");
      setLocationDisplayName("");
    }
  };

  const newActivity = () => {
    setNewActivityPopout(!newActivityPopout);
  };

  const editActivity = () => {
    setEditActivityPopout(!editActivityPopout);
  };

  const saveActivity = (activity) => {
    const temp = activities.filter(function (obj) {
      return obj.id !== activity.id;
    });

    const temp2 = [...temp, activity];
    // console.log("temp2 ", temp2);
    // sorting in chronological order
    temp2.sort(function (a, b) {
      return (
        a.start_date.localeCompare(b.start_date) ||
        a.start_time.localeCompare(b.start_time) ||
        a.end_date.localeCompare(b.end_date) ||
        a.end_time.localeCompare(b.end_time)
      );
    });
    setActivities(temp2);
  };

  const deleteActivity = (activity_id) => {
    const temp = activities.filter(function (obj) {
      return obj.id !== activity_id;
    });

    // making sure everything is sorted in chronologycal order
    temp.sort(function (a, b) {
      return (
        a.start_date.localeCompare(b.startDate) ||
        a.start_time.localeCompare(b.startTime)
      );
    });
    setActivities([...temp]);
  };

  const closePopup = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    getEventDetails();
  }, [props.eventDetails]);

  useEffect(() => {
    checkField(title, setTitleError);
  }, [title]);

  useEffect(() => {
    checkField(description, setDescriptionError);
  }, [description]);

  useEffect(() => {
    formatDate(startDate, setFormattedStartDate, "DD/MM/YYYY");
  }, [startDate]);

  useEffect(() => {
    formatDate(endDate, setFormattedEndDate, "DD/MM/YYYY");
  }, [endDate]);

  useEffect(() => {
    formatTime(startTime, setFormattedStartTime);
  }, [startTime]);

  useEffect(() => {
    formatTime(endTime, setFormattedEndTime);
  }, [endTime]);

  useEffect(() => {
    checkDateAndTime();
  }, [startDate, startTime, endDate, endTime]);

  useEffect(() => {
    getCurrentDate();
  }, [startDate, startTime, endDate, endTime]);

  useEffect(() => {
    checkLocation();
  }, [locationString, locationType, locationDisplayName]);

  const handlePrivacyClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handlePrivacyConfig = (val) => {
    setConfigurePrivacyPopout(val);
  };

  const handleLocationTypeClick = (event) => {
    setLocationTypeAnchor(event.currentTarget);
    setLocationTypeOpen(!locationTypeOpen);
  };

  const handleCategoryClick = (event) => {
    setCategoryAnchorEl(event.currentTarget);
    setOpenCategory(!openCategory);
  };
  const handleClose = (setAnchor, setOpen) => {
    setAnchor(null);
    setOpen(false);
  };

  const handleSubmit = async () => {
    const eventRef = doc(db, "events", props.eventDetails["id"]);
    getCurrentDate();
    checkDateAndTime();
    checkField(title, setTitleError);
    checkField(description, setDescriptionError);
    checkLocation();
    console.log("end date ", formattedEndDate, endDate);
    if (!titleError && !descriptionError && isDateAndTimeValid) {
      console.log("VALID EVENT");
      if (category === "Category") {
        setCategory("");
      }
      await setDoc(eventRef, {
        title: title,
        subtitle: subtitle,
        author: user.uid,
        start_date: formattedStartDate,
        start_time: formattedStartTime,
        end_date: formattedEndDate,
        end_time: formattedEndTime,
        privacy: visibility,
        category: category,
      }).then(async function () {
        console.log("Document written with ID: ", props.eventDetails["id"]);
        const userRef = doc(
          db,
          "users",
          user.uid,
          "events",
          props.eventDetails["id"]
        );
        const eventUsersRef = doc(
          db,
          "events",
          props.eventDetails["id"],
          "users",
          user.uid
        );
        const eventDetailsRef = doc(
          db,
          "events",
          props.eventDetails["id"],
          "data",
          "event_details"
        );
        let end_date_month = "";
        let end_date_day = "";
        let start_date_month = "";
        let start_date_day = "";

        console.log("meetLink", meetLink);

        if (startDate) {
          if (typeof startDate === "string") {
            start_date_day = props.eventDetails["details"].start_date_day;
            start_date_month = props.eventDetails["details"].start_date_month;
          } else {
            start_date_day = startDate["$d"].toString().split(" ")[0];
            start_date_month = startDate["$d"].toString().split(" ")[1];
          }
        }

        if (endDate) {
          if (typeof endDate === "string") {
            end_date_day = props.eventDetails["details"].end_date_day;
            end_date_month = props.eventDetails["details"].end_date_month;
          } else {
            end_date_day = endDate["$d"].toString().split(" ")[0];
            end_date_month = endDate["$d"].toString().split(" ")[1];
          }
        }
        await setDoc(eventDetailsRef, {
          title: title,
          subtitle: subtitle,
          start_date: formattedStartDate,
          start_date_day: start_date_day,
          start_date_month: start_date_month,
          start_time: formattedStartTime,
          end_date: formattedEndDate,
          end_date_day: end_date_day,
          end_date_month: end_date_month,
          end_time: formattedEndTime,
          description: description,
          author: user.uid,
          author_username: user.displayName,
          instagram: instagram,
          tiktok: tiktok,
          twitter: twitter,
          facebook: facebook,
          location_string: locationString,
          location_display_name: locationDisplayName,
          location_type: locationType,
          marker: marker,
          meet_link: meetLink,
          privacy: visibility,
          join_code: joinCode,
          category: category,
        }).then(async function () {
          activities.map(async (activity) => {
            const activitiesRef = doc(
              db,
              "events",
              props.eventDetails["id"],
              "activities",
              activity.id
            );

            await setDoc(activitiesRef, {
              title: activity.title,
              start_date: activity.start_date,
              start_date_day: activity.start_date_day,
              start_date_month: activity.start_date_month,
              start_time: activity.start_time,
              end_date: activity.end_date,
              end_date_day: activity.end_date_day,
              end_date_month: activity.end_date_month,
              end_time: activity.end_time,
              description: activity.description,
              id: activity.id,
              // location_string: activity.locationString,
              // location_display_name: activity.locationDisplayName,
              // location_type: activity.locationType,
              // marker: activity.marker,
              // meet_link: activity.meetLink,
              location_string: activity.location_string,
              location_display_name: activity.location_display_name,
              location_type: activity.location_type,
              marker: activity.marker,
              meet_link: activity.meet_link,
            });
          });
        });

        await setDoc(eventUsersRef, { status: "admin" });
        await setDoc(userRef, {
          status: "admin",
          start_date: formattedStartDate,
          start_time: formattedStartTime,
          end_date: formattedEndDate,
          end_time: formattedEndTime,
        });
        console.log("Event created with ID:", props.eventDetails["id"]);
      });
      props.setEditSelectedEvent(false);
      props.closeEvent();
      props.refreshEdit();
      console.log("SUCCESS");
    } else {
      setShowError(true);
    }
  };

  // console.log("details ", props.eventDetails["activities"]);
  return (
    <>
      <Box
        className={
          isMobile
            ? "display-events-category-box-mobile"
            : "display-events-category-box"
        }
      >
        <Container
          className="card p-4 box mt-4  square rounded-9 border border-2"
          style={{ width: "100%", backgroundColor: "#161616" }}
        >
          <Row>
            <Col style={{ transform: "translateX(0%)" }}>
              <h1 className="d-flex mb-3 fw-bold text-light justify-content-center">
                Edit event
              </h1>{" "}
            </Col>
            <Col
              md="auto"
              style={{ width: "10px", transform: "translateY(-5%)" }}
              className="close-button"
            >
              {/* <div className="close-button"> */}
              <IconButton
                aria-label="close"
                size="small"
                onClick={() => {
                  props.setEditSelectedEvent(false);
                  props.closeEvent();
                  props.refreshEdit();
                }}
              >
                <CloseOutlinedIcon sx={editButtonStyle} />
              </IconButton>
              {/* </div> */}
            </Col>
          </Row>
          <Container className="mt-4 d-flex flex-column justify-content-center">
            <Box>
              {/* Event title */}
              <StyledTextField
                className="mt-3 mb-3 w-100 text-light"
                required
                variant="outlined"
                id="outline-required"
                label="Event Title"
                value={title}
                // defaultValue={title}
                inputProps={{ maxLength: 50 }}
                error={showError === true ? titleError : false}
                helperText={
                  titleError === true && showError === true
                    ? titleErrorMessage
                    : ""
                }
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />

              {/* Event Subtitle */}
              <StyledTextField
                className="mt-3 mb-3 w-100 text-light"
                variant="outlined"
                id="outline-basic"
                label="Event Subitle"
                value={subtitle}
                // defaultValue={subtitle}
                inputProps={{ maxLength: 50 }}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                }}
              />

              {/* Date and time picker */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Row className="mt-2 mb-3">
                  <Col>
                    <DatePicker
                      minDate={inversedCurrentDate}
                      className="w-100"
                      label="Start date"
                      openTo="day"
                      views={["month", "year", "day"]}
                      inputFormat="DD/MM/YYYY"
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                      renderInput={(params) => (
                        <StyledTextField
                          required
                          sx={pickerStyle}
                          {...params}
                          error={showError === true ? startDateError : false}
                          helperText={
                            startDateError === true && showError === true
                              ? startDateErrorMessage
                              : ""
                          }
                        />
                      )}
                    />
                  </Col>

                  <Col>
                    <TimePicker
                      className="w-100"
                      label="Start time"
                      value={startTime}
                      onChange={setStartTime}
                      renderInput={(params) => (
                        <StyledTextField
                          sx={pickerStyle}
                          {...params}
                          error={showError === true ? startTimeError : false}
                          helperText={
                            startTimeError === true && showError === true
                              ? startTimeErrorMessage
                              : ""
                          }
                        />
                      )}
                    />
                  </Col>
                </Row>

                <Row className={`mt-3 mb-3 ${showEndDate}`}>
                  <Col>
                    <DatePicker
                      minDate={inversedCurrentDate}
                      className="w-100"
                      label="End date"
                      openTo="day"
                      views={["month", "year", "day"]}
                      inputFormat="DD/MM/YYYY"
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => (
                        <StyledTextField
                          sx={pickerStyle}
                          {...params}
                          error={showError === true ? endDateError : false}
                          helperText={
                            endDateError === true && showError === true
                              ? endDateErrorMessage
                              : ""
                          }
                        />
                      )}
                    />
                  </Col>

                  <Col>
                    <TimePicker
                      className="w-100"
                      label="End time"
                      value={endTime}
                      onChange={setEndTime}
                      renderInput={(params) => (
                        <StyledTextField
                          sx={pickerStyle}
                          {...params}
                          error={showError === true ? endTimeError : false}
                          helperText={
                            endTimeError === true && showError === true
                              ? endTimeErrorMessage
                              : ""
                          }
                        />
                      )}
                    />
                  </Col>
                </Row>
              </LocalizationProvider>

              {/* End date and time */}
              <ThemeProvider theme={submitButtonTheme}>
                <Button
                  size="small"
                  startIcon={
                    expandDate === false ? (
                      <AddCircleOutlineIcon />
                    ) : (
                      <RemoveCircleOutlineIcon />
                    )
                  }
                  onClick={() => {
                    showDate();
                    setExpandDate(!expandDate);
                  }}
                >
                  End date and time
                </Button>
              </ThemeProvider>

              {/* Event privacy and category*/}
              <Box className="mt-3">
                <Stack direction="row" spacing={3}>
                  {visibility === "Public" ? (
                    <Box className="w-100">
                      <ThemeProvider theme={submitButtonTheme}>
                        <Button
                          aria-controls={open ? "group-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          variant="outlined"
                          color="primary"
                          onClick={handlePrivacyClick}
                          endIcon={<ArrowDropDown />}
                          startIcon={
                            visibility === "Private" ? (
                              <LockOutlinedIcon sx={{ width: "20px" }} />
                            ) : (
                              <PublicOutlinedIcon sx={{ width: "20px" }} />
                            )
                          }
                          sx={{
                            width: "100%",
                            fontWeight: "500",
                            letterSpacing: "1.5px",
                          }}
                        >
                          {visibility}
                        </Button>
                      </ThemeProvider>
                      <Menu
                        id="group-menu"
                        anchorEl={anchorEl}
                        open={open}
                        // open={true}
                        onClose={() => handleClose(setAnchorEl, setOpen)}
                        aria-labelledby="group-demo-button"
                        sx={{
                          minWidth: "120px",
                          // minHeight: "150px",
                          fontWeight: "600",
                          "--List-decorator-size": "24px",
                          borderStyle: "none",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            borderRadius: "25px",
                            bgcolor: "#daa520",
                            zIndex: "2",
                            minHeight: "80px",
                          }}
                        >
                          <Stack direction="column">
                            <Box className="menu-item">
                              <MenuItem
                                sx={new_event_menu_item_style}
                                onClick={() => {
                                  setVisibility("Public");
                                  handleClose(setAnchorEl, setOpen);
                                }}
                              >
                                <Stack direction="row" spacing={0}>
                                  <Box sx={{ transform: "translateY(2px)" }}>
                                    <ListItemDecorator>
                                      <PublicOutlinedIcon fontSize="xs" />
                                    </ListItemDecorator>
                                  </Box>
                                  <Box>Public</Box>
                                </Stack>
                              </MenuItem>
                            </Box>

                            <Box className="menu-item">
                              <MenuItem
                                sx={new_event_menu_item_style}
                                endIcon={<LockOutlinedIcon />}
                                onClick={() => {
                                  setVisibility("Private");
                                  handleClose(setAnchorEl, setOpen);
                                }}
                              >
                                <Stack direction="row" spacing={0}>
                                  <Box sx={{ transform: "translateY(2px)" }}>
                                    <ListItemDecorator>
                                      <LockOutlinedIcon fontSize="xs" />
                                    </ListItemDecorator>
                                  </Box>
                                  <Box>Private</Box>
                                </Stack>
                              </MenuItem>
                            </Box>
                          </Stack>
                        </Box>
                        <ListDivider />
                      </Menu>
                    </Box>
                  ) : (
                    <>
                      <Box className="w-100">
                        <ThemeProvider theme={submitButtonTheme}>
                          <Stack direction="row">
                            <Button
                              aria-controls={open ? "group-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              variant="outlined"
                              color="primary"
                              onClick={handlePrivacyClick}
                              endIcon={<ArrowDropDown />}
                              startIcon={
                                visibility === "Private" ? (
                                  <LockOutlinedIcon sx={{ width: "20px" }} />
                                ) : (
                                  <PublicOutlinedIcon sx={{ width: "20px" }} />
                                )
                              }
                              sx={{
                                width: "100%",
                                fontWeight: "500",
                                letterSpacing: "1.5px",
                                marginRight: "10px",
                              }}
                            >
                              {visibility}
                            </Button>

                            {/* Privacy settings */}
                            <Button
                              aria-controls={open ? "group-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              variant="outlined"
                              // color={
                              //   isPrivacyConfigured ? "primary" : "disabled"
                              // }
                              onClick={() => handlePrivacyConfig(true)}
                              startIcon={<SettingsOutlinedIcon />}
                              sx={{
                                width: "100%",
                                fontWeight: "500",
                                letterSpacing: "1.5px",
                              }}
                            >
                              {console.log("code", joinCode)}
                              {joinCode !== "" ? joinCode : "privacy settings"}
                            </Button>
                          </Stack>
                        </ThemeProvider>
                        <Menu
                          id="group-menu"
                          anchorEl={anchorEl}
                          open={open}
                          // open={true}
                          onClose={() => handleClose(setAnchorEl, setOpen)}
                          aria-labelledby="group-demo-button"
                          sx={{
                            minWidth: "120px",
                            // minHeight: "150px",
                            fontWeight: "600",
                            "--List-decorator-size": "24px",
                            borderStyle: "none",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              borderRadius: "25px",
                              bgcolor: "#daa520",
                              zIndex: "2",
                              minHeight: "80px",
                            }}
                          >
                            <Stack direction="column">
                              <Box className="menu-item">
                                <MenuItem
                                  sx={new_event_menu_item_style}
                                  onClick={() => {
                                    setVisibility("Public");
                                    handleClose(setAnchorEl, setOpen);
                                  }}
                                >
                                  <Stack direction="row" spacing={0}>
                                    <Box sx={{ transform: "translateY(2px)" }}>
                                      <ListItemDecorator>
                                        <PublicOutlinedIcon fontSize="xs" />
                                      </ListItemDecorator>
                                    </Box>
                                    <Box>Public</Box>
                                  </Stack>
                                </MenuItem>
                              </Box>

                              <Box className="menu-item">
                                <MenuItem
                                  sx={new_event_menu_item_style}
                                  endIcon={<LockOutlinedIcon />}
                                  onClick={() => {
                                    setVisibility("Private");
                                    handleClose(setAnchorEl, setOpen);
                                  }}
                                >
                                  <Stack direction="row" spacing={0}>
                                    <Box sx={{ transform: "translateY(2px)" }}>
                                      <ListItemDecorator>
                                        <LockOutlinedIcon fontSize="xs" />
                                      </ListItemDecorator>
                                    </Box>
                                    <Box>Private</Box>
                                  </Stack>
                                </MenuItem>
                              </Box>
                            </Stack>
                          </Box>
                          <ListDivider />
                        </Menu>
                      </Box>
                    </>
                  )}
                  {/* Event category */}
                  <Box className="w-100">
                    <Box>
                      <ThemeProvider theme={submitButtonTheme}>
                        <Button
                          aria-controls={
                            openCategory ? "group-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={openCategory ? "true" : undefined}
                          variant="outlined"
                          color="primary"
                          onClick={handleCategoryClick}
                          endIcon={<ArrowDropDown />}
                          sx={{ width: "100%" }}
                        >
                          {category}
                        </Button>
                      </ThemeProvider>

                      <Menu
                        id="group-menu"
                        anchorEl={categoryAnchorEl}
                        open={openCategory}
                        // open={true}
                        onClose={() =>
                          handleClose(setCategoryAnchorEl, setOpenCategory)
                        }
                        aria-labelledby="group-demo-button"
                        sx={{
                          minWidth: 120,
                          justifyContent: "center",
                          fontWeight: "600",
                          "--List-decorator-size": "24px",
                          borderStyle: "none",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            borderRadius: "25px",
                            bgcolor: "#daa520",
                            zIndex: "2",
                          }}
                        >
                          <Stack direction="column">
                            {" "}
                            {categories.map((cat) => {
                              return (
                                <Box className="menu-item">
                                  <MenuItem
                                    sx={new_event_menu_item_style}
                                    onClick={() => {
                                      setCategory(cat);
                                      handleClose(
                                        setCategoryAnchorEl,
                                        setOpenCategory
                                      );
                                    }}
                                  >
                                    {cat}
                                  </MenuItem>
                                </Box>
                              );
                            })}
                          </Stack>
                        </Box>

                        <ListDivider />
                      </Menu>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Event location */}
              {isMobile ? (
                <>
                  <Box
                    // className="mt-3"
                    sx={{
                      width: "100%",
                      justifyContent: "center",
                      // display: "flex",
                      // marginBottom: 3,
                      // marginTop: 3,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: 3,
                          marginTop: 3,
                          transform: "translateX(-35px)",
                        }}
                      >
                        <ThemeProvider theme={submitButtonTheme}>
                          <Button
                            size="large"
                            startIcon={
                              displayLocation === false ? (
                                <ExpandMoreIcon />
                              ) : (
                                <ExpandLessIcon />
                              )
                            }
                            onClick={() => setDisplayLocation(!displayLocation)}
                          />
                        </ThemeProvider>

                        <Typography
                          color="white"
                          variant="h5"
                          sx={{ marginTop: "3%" }}
                        >
                          Location
                        </Typography>

                        <Box sx={{ width: "20%" }}>
                          <ThemeProvider theme={submitButtonTheme}>
                            <Button
                              aria-controls={
                                locationTypeOpen ? "group-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={
                                locationTypeOpen ? "true" : undefined
                              }
                              variant="text"
                              color="primary"
                              onClick={handleLocationTypeClick}
                              endIcon={<ArrowDropDown />}
                              startIcon={
                                locationType === "Online" ? (
                                  <VideoCameraFrontOutlinedIcon
                                    sx={{ width: "20px" }}
                                  />
                                ) : (
                                  <LocationOnOutlinedIcon
                                    sx={{ width: "20px" }}
                                  />
                                )
                              }
                              sx={{
                                marginLeft: "40%",
                                width: "100px",
                                height: "56px",
                                fontWeight: "500",
                                letterSpacing: "1.5px",
                              }}
                            >
                              {locationType}
                            </Button>
                          </ThemeProvider>
                          <Menu
                            id="group-menu"
                            anchorEl={locationTypeAnchor}
                            open={locationTypeOpen}
                            onClose={() =>
                              handleClose(
                                setLocationTypeAnchor,
                                setLocationTypeOpen
                              )
                            }
                            aria-labelledby="group-demo-button"
                            sx={{
                              minWidth: "120px",
                              // minHeight: "150px",
                              fontWeight: "600",
                              "--List-decorator-size": "24px",
                              borderStyle: "none",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                borderRadius: "25px",
                                bgcolor: "#daa520",
                                zIndex: "2",
                                minHeight: "80px",
                              }}
                            >
                              <Stack direction="column">
                                <Box className="menu-item">
                                  <MenuItem
                                    sx={new_event_menu_item_style}
                                    onClick={() => {
                                      setLocationType("in person");
                                      handleClose(
                                        setLocationTypeAnchor,
                                        setLocationTypeOpen
                                      );
                                    }}
                                  >
                                    <Stack direction="row" spacing={0}>
                                      <Box
                                        sx={{ transform: "translateY(2px)" }}
                                      >
                                        <ListItemDecorator>
                                          <LocationOnOutlinedIcon fontSize="xs" />
                                        </ListItemDecorator>
                                      </Box>
                                      <Box>In Person</Box>
                                    </Stack>
                                  </MenuItem>
                                </Box>

                                <Box className="menu-item">
                                  <MenuItem
                                    sx={new_event_menu_item_style}
                                    endIcon={<VideoCameraFrontOutlinedIcon />}
                                    onClick={() => {
                                      setLocationType("Online");
                                      handleClose(
                                        setLocationTypeAnchor,
                                        setLocationTypeOpen
                                      );
                                    }}
                                  >
                                    <Stack direction="row" spacing={0}>
                                      <Box
                                        sx={{ transform: "translateY(2px)" }}
                                      >
                                        <ListItemDecorator>
                                          <VideoCameraFrontOutlinedIcon fontSize="xs" />
                                        </ListItemDecorator>
                                      </Box>
                                      <Box>Online</Box>
                                    </Stack>
                                  </MenuItem>
                                </Box>
                              </Stack>
                            </Box>
                            <ListDivider />
                          </Menu>
                        </Box>
                      </Box>

                      {/* Location and loccation type */}
                      <Box display={displayLocation === true ? "" : "none"}>
                        <Stack direction="row">
                          {/* Location type */}

                          {/* Location input */}
                          {locationType === "Online" ? (
                            <>
                              <Stack
                                direction="row"
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "left",
                                }}
                              >
                                <ThemeProvider theme={submitButtonTheme}>
                                  <Box
                                    sx={deleteLocationStyle3}
                                    display={
                                      meetLink.length === 0 ? "none" : "flex"
                                    }
                                  >
                                    <IconButton
                                      onClick={() => {
                                        setMeetLink("");
                                      }}
                                    >
                                      <DeleteOutlineOutlinedIcon
                                        sx={{
                                          width: "100%",
                                        }}
                                        color="secondary"
                                      />
                                    </IconButton>
                                  </Box>
                                </ThemeProvider>{" "}
                                <StyledTextField
                                  placeholder="Meeting link"
                                  sx={{ width: "100%" }}
                                  value={meetLink}
                                  onChange={(e) => setMeetLink(e.target.value)}
                                ></StyledTextField>
                              </Stack>
                            </>
                          ) : (
                            <PlacesAutocomplete
                              locationDisplayName={locationDisplayName}
                              setLocationDisplayName={setLocationDisplayName}
                              locationString={locationString}
                              setLocationString={setLocationString}
                              marker={marker}
                              setMarker={setMarker}
                            />
                          )}
                        </Stack>

                        {/* Map integration */}
                        <Box display={locationType === "Online" ? "none" : ""}>
                          <GoogleMapsIntegration
                            setMarker={setMarker}
                            marker={marker}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box
                  className="mt-3"
                  sx={{
                    // justifyContent: "center",
                    // display: "flex",
                    marginBottom: 3,
                    marginTop: 3,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 3,
                        marginTop: 3,
                        transform: "translateX(-35px)",
                      }}
                    >
                      <ThemeProvider theme={submitButtonTheme}>
                        <Button
                          size="large"
                          startIcon={
                            displayLocation === false ? (
                              <ExpandMoreIcon />
                            ) : (
                              <ExpandLessIcon />
                            )
                          }
                          onClick={() => setDisplayLocation(!displayLocation)}
                        />
                        {/* See
                      </Button> */}
                      </ThemeProvider>

                      <Typography color="white" variant="h5">
                        Location
                      </Typography>
                    </Box>

                    {/* Location and loccation type */}
                    <Box display={displayLocation === true ? "" : "none"}>
                      <Stack direction="row">
                        {/* Location type */}
                        <Box className="">
                          <ThemeProvider theme={submitButtonTheme}>
                            <Button
                              aria-controls={
                                locationTypeOpen ? "group-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={
                                locationTypeOpen ? "true" : undefined
                              }
                              variant="text"
                              color="primary"
                              onClick={handleLocationTypeClick}
                              endIcon={<ArrowDropDown />}
                              startIcon={
                                locationType === "Online" ? (
                                  <VideoCameraFrontOutlinedIcon
                                    sx={{ width: "20px" }}
                                  />
                                ) : (
                                  <LocationOnOutlinedIcon
                                    sx={{ width: "20px" }}
                                  />
                                )
                              }
                              sx={{
                                width: "190px",
                                height: "56px",
                                fontWeight: "500",
                                letterSpacing: "1.5px",
                              }}
                            >
                              {locationType}
                            </Button>
                          </ThemeProvider>
                          <Menu
                            id="group-menu"
                            anchorEl={locationTypeAnchor}
                            open={locationTypeOpen}
                            onClose={() =>
                              handleClose(
                                setLocationTypeAnchor,
                                setLocationTypeOpen
                              )
                            }
                            aria-labelledby="group-demo-button"
                            sx={{
                              minWidth: "120px",
                              // minHeight: "150px",
                              fontWeight: "600",
                              "--List-decorator-size": "24px",
                              borderStyle: "none",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                borderRadius: "25px",
                                bgcolor: "#daa520",
                                zIndex: "2",
                                minHeight: "80px",
                              }}
                            >
                              <Stack direction="column">
                                <Box className="menu-item">
                                  <MenuItem
                                    sx={new_event_menu_item_style}
                                    onClick={() => {
                                      setLocationType("in person");
                                      handleClose(
                                        setLocationTypeAnchor,
                                        setLocationTypeOpen
                                      );
                                    }}
                                  >
                                    <Stack direction="row" spacing={0}>
                                      <Box
                                        sx={{ transform: "translateY(2px)" }}
                                      >
                                        <ListItemDecorator>
                                          <LocationOnOutlinedIcon fontSize="xs" />
                                        </ListItemDecorator>
                                      </Box>
                                      <Box>In Person</Box>
                                    </Stack>
                                  </MenuItem>
                                </Box>

                                <Box className="menu-item">
                                  <MenuItem
                                    sx={new_event_menu_item_style}
                                    endIcon={<VideoCameraFrontOutlinedIcon />}
                                    onClick={() => {
                                      setLocationType("Online");
                                      handleClose(
                                        setLocationTypeAnchor,
                                        setLocationTypeOpen
                                      );
                                    }}
                                  >
                                    <Stack direction="row" spacing={0}>
                                      <Box
                                        sx={{ transform: "translateY(2px)" }}
                                      >
                                        <ListItemDecorator>
                                          <VideoCameraFrontOutlinedIcon fontSize="xs" />
                                        </ListItemDecorator>
                                      </Box>
                                      <Box>Online</Box>
                                    </Stack>
                                  </MenuItem>
                                </Box>
                              </Stack>
                            </Box>
                            <ListDivider />
                          </Menu>
                        </Box>

                        {/* Location input */}
                        {locationType === "Online" ? (
                          <>
                            <Stack
                              direction="row"
                              sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <ThemeProvider theme={submitButtonTheme}>
                                <Box
                                  sx={deleteLocationStyle3}
                                  display={
                                    meetLink.length === 0 ? "none" : "flex"
                                  }
                                >
                                  <IconButton
                                    onClick={() => {
                                      setMeetLink("");
                                    }}
                                  >
                                    <DeleteOutlineOutlinedIcon
                                      sx={{
                                        width: "100%",
                                      }}
                                      color="secondary"
                                    />
                                  </IconButton>
                                </Box>
                              </ThemeProvider>{" "}
                              <StyledTextField
                                placeholder="Meeting link"
                                sx={{ width: "100%" }}
                                value={meetLink}
                                onChange={(e) => setMeetLink(e.target.value)}
                              ></StyledTextField>
                            </Stack>
                          </>
                        ) : (
                          <PlacesAutocomplete
                            locationDisplayName={locationDisplayName}
                            setLocationDisplayName={setLocationDisplayName}
                            locationString={locationString}
                            setLocationString={setLocationString}
                            marker={marker}
                            setMarker={setMarker}
                          />
                        )}
                      </Stack>

                      {/* Map integration */}
                      <Box display={locationType === "Online" ? "none" : ""}>
                        <GoogleMapsIntegration
                          setMarker={setMarker}
                          marker={marker}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {/* Add new activity */}
              <Row className="d-flex flex-column mb-3">
                <Col className="d-flex mt-4 mb-3 fs-2 fw-normal text-light justify-content-center">
                  <ThemeProvider theme={submitButtonTheme}>
                    <Button
                      className={activities.length === 0 ? "d-none" : ""}
                      size="large"
                      startIcon={
                        displayActivities === false ? (
                          <ExpandMoreIcon
                            sx={{ transform: "translateX(-5px)" }}
                          />
                        ) : (
                          <ExpandLessIcon
                            sx={{ transform: "translateX(-5px)" }}
                          />
                        )
                      }
                      onClick={() => setDisplayActivities(!displayActivities)}
                    />
                    {/* See
                      </Button> */}
                  </ThemeProvider>
                  <Typography
                    sx={
                      activities.length === 0
                        ? {}
                        : { transform: "translateX(-15px)" }
                    }
                    variant="h5"
                  >
                    Activities{" "}
                  </Typography>
                  <Typography color="#daa520" variant="h6">
                    {activities.length === 0 ? "" : `(${activities.length})`}{" "}
                  </Typography>
                </Col>
                <Col className="mb-3 d-flex justify-content-left">
                  {/* Display activities */}
                  <Row className="d-flex flex-column">
                    <Col className={displayActivities === true ? "" : "d-none"}>
                      <NewEventActivityCard
                        // Passing setters for edit, so we can populate the AddNewActivity Card
                        // when edit button for one of the activities is pressed
                        setActivityID={setEditActivityID}
                        setTrigger={editActivity}
                        setActivityTitle={setEditActivityTitle}
                        setActivityStartDate={setEditActivityStartDate}
                        setActivityStartTime={setEditActivityStartTime}
                        setActivityEndDate={setEditActivityEndDate}
                        setActivityEndTime={setEditActivityEndTime}
                        setActivityDescription={setEditActivityDescription}
                        setActivityExpandDate={setEditActivityExpandDate}
                        setActivityShowEndDate={setEditActivityShowEndDate}
                        setActivityLocationType={setEditActivityLocationType}
                        setActivityLocationDisplayName={
                          setEditActivityLocationDisplayName
                        }
                        setActivityLocationString={
                          setEditActivityLocationString
                        }
                        setActivityMarker={setEditActivityMarker}
                        setActivityMeetLink={setEditActivityMeetLink}
                        activities={activities}
                        editActivityID={editActivityID}
                      />
                    </Col>
                    <Col>
                      {/* <Row className="d-flex flex-row"> */}

                      <ThemeProvider theme={submitButtonTheme}>
                        <Button
                          size="small"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={() => {
                            newActivity();
                          }}
                        >
                          Add new activity
                        </Button>
                      </ThemeProvider>
                      {/* </Row> */}
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Description */}
              <StyledTextField
                className="mt-3 mb-3 w-100 text-light"
                required
                multiline
                id="outline-basic"
                label="Event Description"
                value={description}
                error={showError === true ? descriptionError : false}
                helperText={
                  descriptionError === true && showError === true
                    ? descriptionErrorMessage
                    : ""
                }
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />

              {/* Social media links */}
              <Box className="mt-3">
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThemeProvider theme={submitButtonTheme}>
                    <Button
                      size="large"
                      startIcon={
                        displaySocialLinks === false ? (
                          <ExpandMoreIcon
                            sx={{ transform: "translateX(-30px)" }}
                          />
                        ) : (
                          <ExpandLessIcon
                            sx={{ transform: "translateX(-30px)" }}
                          />
                        )
                      }
                      onClick={() => setDisplaySocialLinks(!displaySocialLinks)}
                    />
                    {/* See
                      </Button> */}
                  </ThemeProvider>
                  <Typography
                    color="#fcfdff"
                    variant="h5"
                    sx={{ transform: "translateX(-30px)" }}
                  >
                    Link social media
                  </Typography>
                </Box>
                <Box
                  className={
                    displaySocialLinks === true ? "mt-2" : "mt-2 d-none"
                  }
                >
                  <AddSocialMediaLinks
                    setPlatform={setPlatform}
                    setOpenPopup={setOpenPopup}
                    closePopup={closePopup}
                    setInstagram={setInstagram}
                    setTitktok={setTiktok}
                    setTwitter={setTwitter}
                    setFacebook={setFacebook}
                    setProfile={setCurrentProfile}
                    instagram={instagram}
                    tiktok={tiktok}
                    twitter={twitter}
                    facebook={facebook}
                  />
                </Box>
              </Box>

              {/* Confirm */}
              <div className="d-flex justify-content-center">
                <ThemeProvider theme={submitButtonTheme}>
                  <Button
                    sx={{
                      color: "white",
                      outline: "#DAA520",
                    }}
                    className="mt-4"
                    variant="outlined"
                    onClick={async () => {
                      checkDateAndTime();
                      handleSubmit();
                    }}
                  >
                    Confirm
                  </Button>
                </ThemeProvider>
              </div>
            </Box>

            {/* New activity popout */}
            <Modal
              sx={{ overflow: "auto" }}
              open={newActivityPopout}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={isMobile ? popupStyleMobile : popupStyle}>
                <AddNewActivity
                  type={"new"}
                  header={"Add New Activity"}
                  trigger={newActivityPopout}
                  setTrigger={newActivity}
                  // all setters and getters for activity reffer to the current
                  // activity that is being created
                  setActivityTitle={setActivityTitle}
                  setActivityStartDate={setActivityStartDate}
                  setActivityStartTime={setActivityStartTime}
                  setActivityEndDate={setActivityEndDate}
                  setActivityEndTime={setActivityEndTime}
                  setActivityDescription={setActivityDescription}
                  setActivityExpandDate={setActivityExpandDate}
                  setActivityShowEndDate={setActivityShowEndDate}
                  setActivityID={setActivityID}
                  setActivityLocationType={setActivityLocationType}
                  setActivityLocationString={setActivityLocationString}
                  setActivityLocationDisplayName={
                    setActivityLocationDisplayName
                  }
                  setActivityMarker={setActivityMarker}
                  setActivityMeetLink={setActivityMeetLink}
                  activityLocationType={activityLocationType}
                  activityLocationString={activityLocationString}
                  activityLocationDisplayName={activityLocationDisplayName}
                  activityMarker={activityMarker}
                  activityMeetLink={activityMeetLink}
                  activityTitle={activityTitle}
                  activityStartDate={activityStartDate}
                  activityStartTime={activityStartTime}
                  activityEndDate={activityEndDate}
                  activityEndTime={activityEndTime}
                  activityDescription={activityDescription}
                  activityExpandDate={activityExpandDate}
                  activityShowEndDate={activityShowEndDate}
                  activityID={activityID}
                  saveActivity={saveActivity}
                  eventLocationString={locationString}
                  eventLocationDisplayName={locationDisplayName}
                  eventLocationType={locationType}
                  eventMarker={marker}
                  eventMeetLink={meetLink}
                  eventStartDate={formattedStartDate}
                  eventStartTime={startTime}
                  eventEndDate={formattedEndDate}
                  eventEndTime={endTime}
                  currentDate={currentDate}
                  currentTime={currentTime}
                  inversedCurrentDate={inversedCurrentDate}
                />
              </Box>
            </Modal>

            {/* Edit activity (using the same card and props as add activity, just different values) */}
            <Modal
              sx={{ overflow: "auto" }}
              open={editActivityPopout}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={popupStyle}>
                <AddNewActivity
                  //prop to identify if popup is edit or new activity
                  type={"edit"}
                  header={"Edit Activity"}
                  trigger={editActivityPopout}
                  setTrigger={editActivity}
                  // all setters and getters for activity reffer to the current
                  // activity that is being edited
                  setActivityTitle={setEditActivityTitle}
                  setActivityStartDate={setEditActivityStartDate}
                  setActivityStartTime={setEditActivityStartTime}
                  setActivityEndDate={setEditActivityEndDate}
                  setActivityEndTime={setEditActivityEndTime}
                  setActivityDescription={setEditActivityDescription}
                  setActivityExpandDate={setEditActivityExpandDate}
                  setActivityShowEndDate={setEditActivityShowEndDate}
                  setActivityID={setEditActivityID}
                  setActivityLocationType={setEditActivityLocationType}
                  setActivityLocationString={setEditActivityLocationString}
                  setActivityLocationDisplayName={
                    setEditActivityLocationDisplayName
                  }
                  setActivityMarker={setEditActivityMarker}
                  setActivityMeetLink={setEditActivityMeetLink}
                  activityLocationType={editActivityLocationType}
                  activityLocationString={editActivityLocationString}
                  activityLocationDisplayName={editActivityLocationDisplayName}
                  activityMarker={editActivityMarker}
                  activityMeetLink={editActivityMeetLink}
                  activityTitle={editActivityTitle}
                  activityStartDate={editActivityStartDate}
                  activityStartTime={editActivityStartTime}
                  activityEndDate={editActivityEndDate}
                  activityEndTime={editActivityEndTime}
                  activityDescription={editActivityDescription}
                  activityExpandDate={editActivityExpandDate}
                  activityShowEndDate={editActivityShowEndDate}
                  activityID={editActivityID}
                  saveActivity={saveActivity}
                  deleteActivity={deleteActivity}
                  eventLocationString={locationString}
                  eventLocationDisplayName={locationDisplayName}
                  eventLocationType={locationType}
                  eventMarker={marker}
                  eventMeetLink={meetLink}
                  eventStartDate={formattedStartDate}
                  eventStartTime={startTime}
                  eventEndDate={formattedEndDate}
                  eventEndTime={endTime}
                  currentDate={currentDate}
                  currentTime={currentTime}
                  inversedCurrentDate={inversedCurrentDate}
                />
              </Box>
            </Modal>

            {/* Privacy settings */}
            <Modal
              sx={{ overflow: "auto" }}
              open={configurePrivacyPopout}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box>
                {/* {console.log("edit start date", editActivityStartDate)} */}

                <PrivacySettingConfigPopover
                  closePopup={handlePrivacyConfig}
                  joinCode={joinCode}
                  setJoinCode={setJoinCode}
                  setIsPrivacyConfigured={setIsPrivacyConfigured}
                  setConfigurePrivacyPopout={setConfigurePrivacyPopout}
                  isPrivacyConfigured={isPrivacyConfigured}
                  setJoinByCodeOpen={setJoinByCodeOpen}
                  joinByCodeOpen={joinByCodeOpen}
                />
              </Box>
            </Modal>

            {/* Add social media link popout */}
            <Modal sx={{ overflow: "auto" }} open={openPopup}>
              <AddSocialMediaLinkPopover
                platform={platform}
                closePopup={closePopup}
                setInsta={setInstagram}
                setTiktok={setTiktok}
                setTwitter={setTwitter}
                setFacebook={setFacebook}
                profile={currentProfile}
                instagram={instagram}
                tiktok={tiktok}
                twitter={twitter}
                facebook={facebook}
              />
            </Modal>
          </Container>
        </Container>
      </Box>
    </>
  );
};

export default EditEvent;
