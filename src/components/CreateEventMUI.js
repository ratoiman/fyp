import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
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
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { Stack, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddSocialMediaLinks from "./AddSocialMediaLinks";
import AddSocialMediaLinkPopover from "./AddSocialMediaLinkPopover";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// TODO add a section to link social media accounts when creating an event
const CreateEvent = () => {
  // const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [showEndDate, setShowEndDate] = useState("d-none");
  const [expandDate, setExpandDate] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [inversedCurrentDate, setInversedCurrentDate] = useState(""); // MM/DD/YYYY to use as minDate bound in <DatePicker startDate>
  const [currentTime, setCurrentTime] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [formattedStartTime, setFormattedStartTime] = useState(null);
  const [formattedStartDate, setFormattedStartDate] = useState(null);
  const [formattedEndTime, setFormattedEndTime] = useState(null);
  const [formattedEndDate, setFormattedEndDate] = useState(null);

  // store data from the latest new activity (in case user didn't finish editing, so nothing will be lost)
  const [newActivityPopout, setNewActivityPopout] = useState(false);
  const [activityID, setActivityID] = useState(null);
  const [activityTitle, setActivityTitle] = useState(null);
  const [activityStartDate, setActivityStartDate] = useState(null);
  const [activityStartTime, setActivityStartTime] = useState(null);
  const [activityEndDate, setActivityEndDate] = useState(null);
  const [activityEndTime, setActivityEndTime] = useState(null);
  const [activityDescription, setActivityDescription] = useState(null);
  const [activityExpandDate, setActivityExpandDate] = useState(false);
  const [activityShowEndDate, setActivityShowEndDate] = useState("d-none");

  const [activities, setActivities] = useState([]);
  const [displayActivities, setDisplayActivities] = useState(true);
  const [displaySocialLinks, setDisplaySocialLinks] = useState(false);

  // States to use when editing an activity, to avoid overwritting an unfinished activity
  const [editActivityPopout, setEditActivityPopout] = useState(false);
  const [editActivityID, setEditActivityID] = useState(null);
  const [editActivityTitle, setEditActivityTitle] = useState(null);
  const [editActivityStartDate, setEditActivityStartDate] = useState(null);
  const [editActivityStartTime, setEditActivityStartTime] = useState(null);
  const [editActivityEndDate, setEditActivityEndDate] = useState(null);
  const [editActivityEndTime, setEditActivityEndTime] = useState(null);
  const [editActivityDescription, setEditActivityDescription] = useState(null);
  const [editActivityExpandDate, setEditActivityExpandDate] = useState(false);
  const [editActivityShowEndDate, setEditActivityShowEndDate] =
    useState("d-none");

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
  const categories = ["Music", "Improv", "Sports", "Drama", "Party"];
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  // Location and location type
  const [locationType, setLocationType] = useState("in person");
  const [locationTypeAnchor, setLocationTypeAnchor] = useState(null);
  const [locationTypeOpen, setLocationTypeOpen] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(true);
  const [marker, setMarker] = useState("")

  // Social media links
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [platform, setPlatform] = useState("");
  const [currentProfile, setCurrentProfile] = useState("");

  let isDateAndTimeValid = false;

  const { user } = useUserAuth();
  const today = new Date();

  // Backend references
  const eventsRef = collection(db, "events");

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/home");
  };

  const formatDate = (date, setter, format) => {
    let formatted = null;
    if (date) {
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

    setter(formatted);
  };

  const formatTime = (time, setter) => {
    if (time) {
      const hours = time.toDate().getHours().toString();
      const minutes = time.toDate().getMinutes().toString();

      setter(hours.padStart(2, "0") + ":" + minutes.padStart(2, "0"));
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
    // sorting in chronological order
    temp2.sort(function (a, b) {
      return (
        a.startDate.localeCompare(b.startDate) ||
        a.startTime.localeCompare(b.startTime) ||
        a.endDate.localeCompare(b.endDate) ||
        a.endTime.localeCompare(b.endTime)
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
        a.startDate.localeCompare(b.startDate) ||
        a.startTime.localeCompare(b.startTime)
      );
    });
    setActivities([...temp]);
  };

  const closePopup = () => {
    setOpenPopup(false);
  };

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

  const handlePrivacyClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
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
    getCurrentDate();
    checkDateAndTime();
    checkField(title, setTitleError);
    checkField(description, setDescriptionError);

    if (!titleError && !descriptionError && isDateAndTimeValid) {
      console.log("VALID EVENT");
      if (category === "Category") {
        setCategory("");
      }
      await addDoc(eventsRef, {
        title: title,
        subtitle: subtitle,
        author: user.uid,
        start_date: formattedStartDate,
        start_time: formattedStartTime,
        end_date: formattedEndDate,
        end_time: formattedEndTime,
        privacy: visibility,
        category: category,
      }).then(async function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        const userRef = doc(db, "users", user.uid, "events", docRef.id);
        const eventUsersRef = doc(db, "events", docRef.id, "users", user.uid);
        const eventDetailsRef = doc(
          db,
          "events",
          docRef.id,
          "data",
          "event_details"
        );
        let end_date_month = "";
        let end_date_day = "";

        if (endDate) {
          end_date_day = endDate["$d"].toString().split(" ")[0];
          end_date_month = endDate["$d"].toString().split(" ")[1];
        }
        await setDoc(eventDetailsRef, {
          title: title,
          subtitle: subtitle,
          start_date: formattedStartDate,
          start_date_day: startDate["$d"].toString().split(" ")[0],
          start_date_month: startDate["$d"].toString().split(" ")[1],
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
        }).then(async function () {
          activities.map(async (activity) => {
            const activitiesRef = doc(
              db,
              "events",
              docRef.id,
              "activities",
              activity.id
            );
            await setDoc(activitiesRef, {
              title: activity.title,
              start_date: activity.startDate,
              start_date_day: activity.start_date_day,
              start_date_month: activity.start_date_month,
              start_time: activity.startTime,
              end_date: activity.endDate,
              end_date_day: activity.end_date_day,
              end_date_month: activity.end_date_month,
              end_time: activity.endTime,
              description: activity.description,
              id: activity.id,
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
        console.log("Event created with ID:", docRef.id);
      });
      navigate("/home");
      console.log("SUCCESS");
    } else {
      setShowError(true);
    }
  };

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
          className="card p-4 box mt-4  square rounded-9 border bg-dark border-2"
          style={{ width: "100%" }}
        >
          <Row>
            <h1 className="d-flex mb-3 fw-bold text-light justify-content-center">
              Create new event MUI
            </h1>{" "}
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
                defaultValue=""
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
                defaultValue=""
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
              {/* //TODO add event location (add option to select if event is in person or virtual) */}
              {/* Event privacy and category*/}
              <Box className="mt-3">
                <Stack direction="row" spacing={3}>
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
                                    <Box sx={{ transform: "translateY(2px)" }}>
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
                                    <Box sx={{ transform: "translateY(2px)" }}>
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
                      <Box sx={{ width: "100%" }}>
                        <StyledTextField
                          sx={{ width: "100%" }}
                          placeholder={
                            locationType === "Online"
                              ? "Meeting link"
                              : "Location"
                          }
                        ></StyledTextField>
                      </Box>
                    </Stack>

                    {/* Map integration */}
                    <Box>
                      <GoogleMapsIntegration setMarker={setMarker} marker={marker} />
                    </Box>
                  </Box>
                </Box>

                <Stack direction="row" spacing={3}>
                  <Box className="w-100"></Box>
                </Stack>
              </Box>
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
                defaultValue=""
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

export default CreateEvent;
