import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";
import "./../css/NewActivity.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  StyledTextField,
  pickerStyle,
  editButtonStyle,
  deleteButtonStyle,
  submitButtonTheme,
  new_event_menu_item_style,
  deleteLocationStyle3,
  deleteLocationStyleMobile,
} from "../ui_styles/MuiStyles";
import { v4 as uuid } from "uuid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import { Stack, Typography } from "@mui/material";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PlacesAutocomplete from "./PlacesAutocomplete";
import GoogleMapsIntegration from "./GoogleMapsIntegration";
import { isMobile } from "react-device-detect";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const AddNewActivity = (props) => {
  // Format event dates to MM/DD/YYYY so they can be passed to DatePicker as default values

  let eventStartDate = null;
  if (props.eventStartDate) {
    eventStartDate =
      props.eventStartDate[3] +
      props.eventStartDate[4] +
      "/" +
      props.eventStartDate[0] +
      props.eventStartDate[1] +
      "/" +
      props.eventStartDate[6] +
      props.eventStartDate[7] +
      props.eventStartDate[8] +
      props.eventStartDate[9];
  }
  let eventEndDate = null;
  if (props.eventEndDate) {
    eventEndDate =
      props.eventEndDate[3] +
      props.eventEndDate[4] +
      "/" +
      props.eventEndDate[0] +
      props.eventEndDate[1] +
      "/" +
      props.eventEndDate[6] +
      props.eventEndDate[7] +
      props.eventEndDate[8] +
      props.eventEndDate[9];
  }

  const [title, setTitle] = useState(props.activityTitle);
  const [description, setDescription] = useState(props.activityDescription);

  const [startDate, setStartDate] = useState(props.activityStartDate);
  const [formattedStartDate, setFormattedStartDate] = useState("");

  const [startTime, setStartTime] = useState(props.activityStartTime);
  const [formattedStartTime, setFormattedStartTime] = useState("");

  const [endDate, setEndDate] = useState(props.activityEndDate);
  const [formattedEndDate, setFormattedEndDate] = useState("");

  const [endTime, setEndTime] = useState(props.activityEndTime);
  const [formattedEndTime, setFormattedEndTime] = useState("");

  const [expandDate, setExpandDate] = useState(props.activityExpandDate);
  const [showEndDate, setShowEndDate] = useState(props.activityShowEndDate);

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

  // Location variables
  const [locationType, setLocationType] = useState(props.activityLocationType);
  const [locationTypeAnchor, setLocationTypeAnchor] = useState(null);
  const [locationTypeOpen, setLocationTypeOpen] = useState(false);
  const [locationString, setLocationString] = useState(
    props.activityLocationString
  );
  const [displayLocation, setDisplayLocation] = useState(true);
  const [marker, setMarker] = useState(props.activityMarker);
  const [locationDisplayName, setLocationDisplayName] = useState(
    props.activityLocationDisplayName
  );
  const [meetLink, setMeetLink] = useState(props.activityMeetLink);

  // const [isDateAndTimeValid, setIsDateAndTimeValid] = useState(false);

  let isDateAndTimeValid = false;

  let activityDetails = new Object();

  const formatDate = (date, setter, format) => {
    let formatted = null;
    try {
      if (date && typeof date !== Object) {
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
    } catch (e) {
      if (date) {
        const day = date.getDate().toString();
        const month = (date.getMonth() + 1).toString();
        const year = date.getFullYear().toString();

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
    try {
      if (time) {
        const hours = time.toDate().getHours().toString();
        const minutes = time.toDate().getMinutes().toString();

        setter(hours.padStart(2, "0") + ":" + minutes.padStart(2, "0"));
      }
    } catch (e) {
      if (time) {
        const hours = time.getHours().toString();
        const minutes = time.getMinutes().toString();

        setter(hours.padStart(2, "0") + ":" + minutes.padStart(2, "0"));
      }
    }
  };

  const showDate = () => {
    if (showEndDate === "") {
      setShowEndDate("d-none");
      props.setActivityShowEndDate("d-none");
      setExpandDate("");
      props.setActivityExpandDate("");
    } else {
      setShowEndDate("");
      props.setActivityShowEndDate("");
      setExpandDate("d-none");
      props.setActivityExpandDate("d-none");
    }
  };

  const checkDateAndTime = () => {
    isDateAndTimeValid = true;

    if (startDate === null || startDate === "") {
      isDateAndTimeValid = false;
      setStartDateError(true);
      setStartDateErrorMessage("Please select a start date");
    }

    if (formattedStartDate < props.currentDate) {
      isDateAndTimeValid = false;
      setStartDateError(true);
      setStartDateErrorMessage("Start date can't be in the past");
    }

    if (formattedStartTime) {
      if (
        formattedStartTime < props.currentTime &&
        formattedStartDate === props.currentDate
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
      setEndTimeError(false);
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

  const saveActivity = () => {
    formatDate(startDate, setFormattedStartDate, "DD/MM/YYYY");
    formatDate(endDate, setFormattedEndDate, "DD/MM/YYYY");
    formatTime(startTime, setFormattedStartTime);
    formatTime(endTime, setFormattedEndTime);
    activityDetails.title = title;
    activityDetails.startDate = formattedStartDate;
    if (startDate !== null) {
      if (startDate["$d"] !== undefined) {
        console.log("Start date ", startDate, startDate !== undefined);
        activityDetails.start_date_day = startDate["$d"]
          .toString()
          .split(" ")[0];
        activityDetails.start_date_month = startDate["$d"]
          .toString()
          .split(" ")[1];
      } else {
        activityDetails.start_date_day = startDate.toString().split(" ")[0];
        activityDetails.start_date_month = startDate.toString().split(" ")[1];
      }
    }
    activityDetails.startTime = formattedStartTime;
    activityDetails.endDate = formattedEndDate;
    if (endDate !== null && endDate !== "") {
      if (endDate["$d"] !== undefined) {
        activityDetails.end_date_day = endDate["$d"].toString().split(" ")[0];

        activityDetails.end_date_month = endDate["$d"].toString().split(" ")[1];
      } else {
        activityDetails.end_date_day = endDate.toString().split(" ")[0];

        activityDetails.end_date_month = endDate.toString().split(" ")[1];
      }
    } else {
      activityDetails.end_date_day = "";
      activityDetails.end_date_month = "";
    }
    activityDetails.endTime = formattedEndTime;
    activityDetails.description = description;
    activityDetails.id = props.activityID;
    activityDetails.locationType = locationType;
    activityDetails.locationString = locationString;
    activityDetails.marker = marker;
    activityDetails.locationDisplayName = locationDisplayName;
    activityDetails.meetLink = meetLink;
  };

  const handleDelete = () => {
    console.log("Handle delete", props.activityID);
    if (
      props.activityID === undefined ||
      props.activityID === "" ||
      props.activityID === null
    ) {
      props.setActivityTitle("");
      props.setActivityStartDate("");
      props.setActivityStartTime("");
      props.setActivityEndDate("");
      props.setActivityEndTime("");
      props.setActivityDescription("");
      props.setActivityExpandDate("");
      props.setActivityShowEndDate("d-none");
      props.setTrigger(false);
    } else {
      if (props.activityID.length > 1) {
        props.setActivityTitle("");
        props.setActivityStartDate("");
        props.setActivityStartTime("");
        props.setActivityEndDate("");
        props.setActivityEndTime("");
        props.setActivityDescription("");
        props.setActivityExpandDate("");
        props.setActivityShowEndDate("d-none");
        props.deleteActivity(props.activityID);
        props.setTrigger(false);
      }
    }
  };

  const handleLocationTypeClick = (event) => {
    setLocationTypeAnchor(event.currentTarget);
    setLocationTypeOpen(!locationTypeOpen);
  };

  const setLocationDefault = () => {
    if (locationType === "") {
      setLocationType("Same as event");
    }

    if (locationType === "Same as event") {
      if (props.eventLocationType === "online") {
        setMeetLink(props.eventMeetLink);
      } else {
        console.log("props ", props.locationString);
        if (props.locationString === undefined || props.locationString === "") {
          setLocationString("");
        } else {
          setLocationString(props.locationString);
        }

        if (
          props.locationDisplayName === undefined ||
          props.locationDisplayName === ""
        ) {
          setLocationDisplayName("");
        } else {
          setLocationDisplayName(props.locationDisplayName);
        }

        if (props.marker === undefined || props.marker === "") {
          setMarker("");
        } else {
          setMarker(props.eventMarker);
        }
      }
    }
  };

  useEffect(() => {
    setLocationDefault();
  }, [props.locationString]);

  useEffect(() => {
    checkField(title, setTitleError);
  }, [title]);

  useEffect(() => {
    checkField(description, setDescriptionError);
  }, [description]);

  useEffect(() => {
    saveActivity();
  }, [title, startDate, endDate, startTime, endTime, description]);

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
  }, [
    formattedStartDate,
    formattedStartTime,
    formattedEndDate,
    formattedEndTime,
  ]);

  const handleClose = (setAnchor, setOpen) => {
    setAnchor(null);
    setOpen(false);
  };

  const handleCloseModal = () => {
    console.log("Props ", locationType);
    props.setActivityLocationType(locationType);
    props.setActivityLocationString(locationString);
    props.setActivityLocationDisplayName(locationDisplayName);
    props.setActivityMarker(marker);
    props.setActivityMeetLink(meetLink);
    props.setTrigger(false);
  };

  const handleSubmit = () => {
    saveActivity();

    checkField(title, setTitleError);
    checkField(description, setDescriptionError);
    checkDateAndTime();
    if (
      titleError === true ||
      descriptionError === true ||
      isDateAndTimeValid === false
    ) {
      setShowError(true);
    } else {
      if (props.type === "new") {
        activityDetails.id = uuid().slice(0, 8);
      }
      props.saveActivity(activityDetails);

      // Cleanup activity states from CreateEvent

      props.setActivityTitle("");
      props.setActivityStartDate(null);
      props.setActivityStartTime(null);
      props.setActivityEndDate(null);
      props.setActivityEndTime(null);
      props.setActivityDescription("");
      props.setTrigger(false);
    }
  };

  // console.log("ID ", activityDetails.id === undefined );
  return props.trigger ? (
    <>
      <div className="close-button">
        <IconButton
          aria-label="close"
          size="small"
          onClick={() => {
            handleCloseModal();
          }}
        >
          {/* using same style as edit button, no need to create new style */}
          <CloseOutlinedIcon sx={editButtonStyle} />
        </IconButton>
      </div>
      <Container className="justify-content-center">
        <h1 style={{ color: "#DAA520" }}>{props.header}</h1>

        {/* Activity title */}
        <StyledTextField
          className="mt-3 mb-3 w-100 text-light"
          required
          variant="outlined"
          id="outline-required"
          label="Event Title"
          defaultValue={title}
          error={showError === true ? titleError : false}
          helperText={
            titleError === true && showError === true ? titleErrorMessage : ""
          }
          onChange={(e) => {
            checkField(title, setTitleError);
            props.setActivityTitle(e.target.value);
            setTitle(e.target.value);
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Start date */}
          <Row className="mt-2 mb-3">
            <Col>
              <DatePicker
                minDate={
                  eventStartDate === null
                    ? props.inversedCurrentDate
                    : eventStartDate
                }
                className="w-100"
                label="Start date"
                openTo="day"
                views={["month", "year", "day"]}
                inputFormat="DD/MM/YYYY"
                value={startDate}
                onChange={(newValue) => {
                  props.setActivityStartDate(newValue);
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

            {/* Start time */}
            <Col>
              <TimePicker
                className="w-100"
                label="Start time"
                value={startTime}
                onChange={(newValue) => {
                  props.setActivityStartTime(newValue);
                  setStartTime(newValue);
                }}
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

          {/* End date */}
          <Row className={`mt-3 mb-3 ${showEndDate}`}>
            <Col>
              <DatePicker
                maxDate={eventEndDate}
                minDate={
                  eventStartDate === null
                    ? props.inversedCurrentDate
                    : eventStartDate
                }
                className="w-100"
                label="End date"
                openTo="day"
                views={["month", "year", "day"]}
                inputFormat="DD/MM/YYYY"
                value={endDate}
                onChange={(newValue) => {
                  props.setActivityEndDate(newValue);
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

            {/* End time */}
            <Col>
              <TimePicker
                className="w-100"
                label="End time"
                value={endTime}
                onChange={(newValue) => {
                  props.setActivityEndTime(newValue);
                  setEndTime(newValue);
                }}
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

        {/* Expand dates button */}

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

        {/* Location */}
        {isMobile ? (
          // Mobile
          <Box
            className=""
            sx={{
              borderStyle: "solid",
              borderColor: "gray",
              display: "flex",
              borderWidth: "0.7px",
              borderRadius: "5px",
              marginTop: "1.5%",
              padding: 1,
              maxWidth: "100%",
            }}
          >
            <Stack direction="column" sx={{ maxWidth: "100%" }}>
              {console.log("type ", locationType)}
              <Stack direction="row" sx={{ justifyContent: "center" }}>
                <Box
                  // display="none"
                  display={locationType === "Same as event" ? "none" : ""}
                >
                  <ThemeProvider theme={submitButtonTheme}>
                    <Button
                      // display={locationType === "Same as event" ? "" :"none"}
                      sx={{ marginTop: "15%", marginLeft: "15%" }}
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
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    color="white"
                    sx={{ marginTop: "15%", marginLeft: "5%" }}
                  >
                    Location
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: "0%" }}>
                  <ThemeProvider theme={submitButtonTheme}>
                    <Button
                      aria-controls={
                        locationTypeOpen ? "group-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={locationTypeOpen ? "true" : undefined}
                      variant="text"
                      color="primary"
                      onClick={handleLocationTypeClick}
                      endIcon={<ArrowDropDown />}
                      startIcon={
                        locationType === "Online" ? (
                          <VideoCameraFrontOutlinedIcon
                            sx={{ width: "20px" }}
                          />
                        ) : locationType === "in person" ? (
                          <LocationOnOutlinedIcon sx={{ width: "20px" }} />
                        ) : (
                          <CheckCircleOutlineOutlinedIcon
                            sx={{ width: "20px" }}
                          />
                        )
                      }
                      sx={
                        locationType === "Same as event"
                          ? {
                              width: "190px",
                              height: "56px",
                              fontWeight: "500",
                              letterSpacing: "1.5px",
                              marginLeft: "15%",
                            }
                          : {
                              width: "190px",
                              height: "56px",
                              fontWeight: "500",
                              letterSpacing: "1.5px",
                            }
                      }
                    >
                      {locationType}
                    </Button>
                  </ThemeProvider>
                  <Menu
                    id="group-menu"
                    anchorEl={locationTypeAnchor}
                    open={locationTypeOpen}
                    onClose={() =>
                      handleClose(setLocationTypeAnchor, setLocationTypeOpen)
                    }
                    aria-labelledby="group-demo-button"
                    sx={{
                      minWidth: "120px",
                      // minHeight: "150px",
                      fontWeight: "600",
                      "--List-decorator-size": "20px",
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
                              setLocationType("Same as event");
                              handleClose(
                                setLocationTypeAnchor,
                                setLocationTypeOpen
                              );
                            }}
                          >
                            <Stack direction="row" spacing={0}>
                              <Box sx={{ transform: "translateY(2px)" }}>
                                <ListItemDecorator>
                                  <CheckCircleOutlineOutlinedIcon fontSize="xs" />
                                </ListItemDecorator>
                              </Box>
                              <Box>Same as event</Box>
                            </Stack>
                          </MenuItem>
                        </Box>
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
              </Stack>
              {locationType === "Online" ? (
                <>
                  <Stack
                    display={displayLocation === false ? "none" : "flex"}
                    direction="row"
                    sx={{
                      width: "100%",
                      justifyContent: "left",
                    }}
                  >
                    <ThemeProvider theme={submitButtonTheme}>
                      <Box
                        sx={deleteLocationStyleMobile}
                        display={meetLink.length === 0 ? "none" : "flex"}
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
              ) : locationType === "in person" ? (
                <>
                  <Box
                    display={displayLocation === false ? "none" : "flex"}
                    sx={{
                      width: "100%",
                      marginTop: "0.35%",
                      marginRight: "0.5%",
                    }}
                  >
                    <PlacesAutocomplete
                      locationDisplayName={locationDisplayName}
                      setLocationDisplayName={setLocationDisplayName}
                      locationString={locationString}
                      setLocationString={setLocationString}
                      marker={marker}
                      setMarker={setMarker}
                    />

                    {/* Map integration */}
                  </Box>
                </>
              ) : (
                <></>
              )}
              {/* </Stack> */}
              <Box
                sx={{ width: "100%" }}
                display={
                  displayLocation === false
                    ? "none"
                    : locationType === "in person"
                    ? ""
                    : "none"
                }
                // display={locationType === "in person" ? "" : "none"}
              >
                <GoogleMapsIntegration setMarker={setMarker} marker={marker} />
              </Box>
            </Stack>
          </Box>
        ) : (
          // Desktop
          <Box
            className=""
            sx={{
              borderStyle: "solid",
              borderColor: "gray",
              display: "flex",
              borderWidth: "0.7px",
              borderRadius: "5px",
              marginTop: "1.5%",
              padding: 1,
            }}
          >
            <Stack direction="column" sx={{ width: "100%" }}>
              <Stack direction="row" sx={{ width: "100%" }}>
                <Box>
                  <Typography
                    variant="h6"
                    color="white"
                    sx={{ marginTop: "15%", marginLeft: "10%" }}
                  >
                    Location
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: "5%" }}>
                  <ThemeProvider theme={submitButtonTheme}>
                    <Button
                      aria-controls={
                        locationTypeOpen ? "group-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={locationTypeOpen ? "true" : undefined}
                      variant="text"
                      color="primary"
                      onClick={handleLocationTypeClick}
                      endIcon={<ArrowDropDown />}
                      startIcon={
                        locationType === "Online" ? (
                          <VideoCameraFrontOutlinedIcon
                            sx={{ width: "20px" }}
                          />
                        ) : locationType === "in person" ? (
                          <LocationOnOutlinedIcon sx={{ width: "20px" }} />
                        ) : (
                          <CheckCircleOutlineOutlinedIcon
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
                      handleClose(setLocationTypeAnchor, setLocationTypeOpen)
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
                              setLocationType("Same as event");
                              handleClose(
                                setLocationTypeAnchor,
                                setLocationTypeOpen
                              );
                            }}
                          >
                            <Stack direction="row" spacing={0}>
                              <Box sx={{ transform: "translateY(2px)" }}>
                                <ListItemDecorator>
                                  <CheckCircleOutlineOutlinedIcon fontSize="xs" />
                                </ListItemDecorator>
                              </Box>
                              <Box>Same as event</Box>
                            </Stack>
                          </MenuItem>
                        </Box>
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
                          display={meetLink.length === 0 ? "none" : "flex"}
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
                ) : locationType === "in person" ? (
                  <>
                    <Box
                      sx={{
                        width: "100%",
                        marginTop: "0.35%",
                        marginRight: "0.5%",
                      }}
                    >
                      <PlacesAutocomplete
                        locationDisplayName={locationDisplayName}
                        setLocationDisplayName={setLocationDisplayName}
                        locationString={locationString}
                        setLocationString={setLocationString}
                        marker={marker}
                        setMarker={setMarker}
                      />

                      {/* Map integration */}
                    </Box>
                  </>
                ) : (
                  <></>
                )}
              </Stack>
              <Box
                sx={{ width: "100%" }}
                display={locationType === "in person" ? "" : "none"}
              >
                <GoogleMapsIntegration setMarker={setMarker} marker={marker} />
              </Box>
            </Stack>
          </Box>
        )}

        {/* Description */}
        <StyledTextField
          className="mt-3 mb-3 w-100 text-light"
          required
          multiline
          id="outline-basic"
          label="Event Description"
          defaultValue={description}
          error={showError === true ? descriptionError : false}
          helperText={
            descriptionError === true && showError === true
              ? descriptionErrorMessage
              : ""
          }
          onChange={(e) => {
            props.setActivityDescription(e.target.value);
            setDescription(e.target.value);
          }}
        />
      </Container>
      <Container style={{ margin: "0px", paddingLeft: "3px" }}>
        <Row>
          <Col>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => {
                handleDelete();
              }}
            >
              <DeleteOutlineOutlinedIcon sx={deleteButtonStyle} />
            </IconButton>
          </Col>
          <Col className="save-button">
            <ThemeProvider theme={submitButtonTheme}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSubmit}
                sx={{ color: "#DAA520" }}
              >
                Submit
              </Button>
            </ThemeProvider>
          </Col>
        </Row>
      </Container>
    </>
  ) : (
    ""
  );
};

export default AddNewActivity;
