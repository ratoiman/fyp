import React, { useEffect, useState } from "react";
import { PlusCircleDotted, DashCircleDotted } from "react-bootstrap-icons";
import { Col, Container, Row, Form, Alert } from "react-bootstrap";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import AddNewActivity from "./AddNewActivity";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import {
  StyledTextField,
  pickerStyle,
  popupStyle,
} from "../ui_styles/MuiStyles";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

// TODO add a section to link social media accounts when creating an event
const CreateEvent = () => {
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [eventIsValid, setEventIsValid] = useState(false);
  const [showEndDate, setShowEndDate] = useState("d-none");
  const [expandDate, setExpandDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [inversedCurrentDate, setInversedCurrentDate] = useState(""); // MM/DD/YYYY to use as minDate bound in <DatePicker startDate>
  const [currentTime, setCurrentTime] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [isDateAndTimeValid, setIsDateAndTimeValid] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [newActivityPopout, setNewActivityPopout] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [formattedStartTime, setFormattedStartTime] = useState(null);
  const [formattedStartDate, setFormattedStartDate] = useState(null);
  const [formattedEndTime, setFormattedEndTime] = useState(null);
  const [formattedEndDate, setFormattedEndDate] = useState(null);

  // store data from the latest new activity (in case user didn't finish editing, so nothing will be lost)
  const [activityTitle, setActivityTitle] = useState(null);
  const [activityStartDate, setActivityStartDate] = useState(null);
  const [activityStartTime, setActivityStartTime] = useState(null);
  const [activityEndDate, setActivityEndDate] = useState(null);
  const [activityEndTime, setActivityEndTime] = useState(null);
  const [activityDescription, setActivityDescription] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityExpandDate, setActivityExpandDate] = useState("");
  const [activityShowEndDate, setActivityShowEndDate] = useState("d-none");

  // error and validation handling

  const [titleError, setTitleError] = useState(false);
  const [startDateErrorMessage, setStartDateErrorMessage] = useState(null);
  const [startDateError, setStartDateError] = useState(null);
  const [startTimeError, setStartTimeError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);

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
      setExpandDate("");
    } else {
      setShowEndDate("");
      setExpandDate("d-none");
    }
  };

  const checkDateAndTime = () => {
    getCurrentDate();
    setIsDateAndTimeValid(true);
    if (!formattedStartDate) {
      setIsDateAndTimeValid(false);
      setError("Please select a start date");
    }
    if (formattedStartDate < currentDate) {
      setIsDateAndTimeValid(false);
      setError("Start date can't be in the past");
    }
    if (formattedStartTime) {
      if (
        formattedStartTime < currentTime &&
        formattedStartDate === currentDate
      ) {
        setIsDateAndTimeValid(false);
        setError("Start time can't be in the past");
      }
    }
    if (formattedEndDate) {
      if (formattedEndDate < formattedStartDate) {
        setIsDateAndTimeValid(false);
        setError("End date can't be before start date");
      }
    }
    if (!formattedEndDate && formattedEndTime) {
      setIsDateAndTimeValid(false);
      setError("Please, select a valid end date");
    }
    if (
      formattedEndDate === formattedStartDate &&
      formattedStartTime &&
      formattedEndTime &&
      formattedEndTime < formattedStartTime
    ) {
      setIsDateAndTimeValid(false);
      setError("End time can't be before start time");
    }

    if (isDateAndTimeValid) {
      setError("");
    } else {
      setEventIsValid(false);
    }
  };

  const checkFields = () => {
    if (
      title.length !== 0 &&
      description.length !== 0 &&
      isDateAndTimeValid === true
    ) {
      setEventIsValid(true);
      setError("");
    } else {
      if (title.length === 0) {
        setError("Title can't be empty");
        setEventIsValid(false);
      }

      if (description.length === 0) {
        setError("Description can't be empty");
        setEventIsValid(false);
      }
    }
  };

  const newActivity = () => {
    setNewActivityPopout(!newActivityPopout);
  };

  const saveActivity = (activity) => {
    setActivities([...activities, activity]);
  };

  useEffect(() => {
    checkFields();
  }, [title, description]);
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

  const handleSubmit = async () => {
    checkDateAndTime();
    checkFields();
    console.log("Checked fields, eventIsValid", eventIsValid);
    if (eventIsValid) {
      await addDoc(eventsRef, {
        title: title,
        subtitle: subtitle,
        author: user.uid,
      }).then(async function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        const userRef = doc(db, "users", user.uid, "events", docRef.id);
        const eventRef = doc(db, "events", docRef.id, "users", user.uid);
        const eventDetailsRef = doc(
          db,
          "events",
          docRef.id,
          "data",
          "event_details"
        );
        await setDoc(eventDetailsRef, {
          title: title,
          subtitle: subtitle,
          start_date: formattedStartDate,
          start_time: formattedStartTime,
          end_date: formattedEndDate,
          end_time: formattedEndTime,
          description: description,
          author: user.uid,
          author_username: user.displayName,
        });
        await setDoc(eventRef, { status: "admin" });
        await setDoc(userRef, { status: "admin" });
        console.log("Event created with ID:", docRef.id);
      });
      navigate("/home");
    } else {
      setShowAlert(true);
    }
  };

  {console.log(activities)}

  return (
    <>
      <Button onClick={handleHome}>Home</Button>
      <Container
        className="card p-4 box mt-4  square rounded-9 border bg-dark border-2"
        style={{ minWidth: "50%", maxWidth: "60%" }}
      >
        <Row>
          <h1 className="d-flex mb-3 fw-bold text-light justify-content-center">
            Create new event MUI
          </h1>{" "}
        </Row>
        {error && (
          <Alert
            show={showAlert}
            variant="danger"
            onClick={() => setShowAlert(false)}
            dismissible
          >
            {error}
          </Alert>
        )}
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
              helperText={"*max 50 characters"}
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
              helperText={"*max 50 characters"}
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
                      <StyledTextField required sx={pickerStyle} {...params} />
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
                      <StyledTextField sx={pickerStyle} {...params} />
                    )}
                  />
                </Col>
              </Row>

              <Row className={`mt-3 mb-3 ${showEndDate}`}>
                <Col>
                  <DatePicker
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
                      <StyledTextField sx={pickerStyle} {...params} />
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
                      <StyledTextField sx={pickerStyle} {...params} />
                    )}
                  />
                </Col>
              </Row>
            </LocalizationProvider>

            {/* End date and time */}
            <Link
              className="d-flex  justify-content-left mb-4 create_event_links"
              style={{ textDecoration: "none" }}
              onClick={showDate}
            >
              <Row className="">
                <Col md="auto">
                  <i>
                    {" "}
                    <PlusCircleDotted className={`${expandDate}`} />
                    <DashCircleDotted className={`${showEndDate}`} />
                  </i>
                </Col>
                <Col>End date and time</Col>
              </Row>
            </Link>

            {/* //TODO add event location (add option to select if event is in person or virtual) */}

            {/* Add new activity */}
            <Row className="d-flex flex-column mb-3">
              <Col className="d-flex mb-3 fs-2 fw-normal justify-content-center">
                Activities
              </Col>
              <Col className="mb-3 d-flex justify-content-left">
                {/* Display activities */}
                <Row className="d-flex flex-column">
                  <Col>
                    {activities.map((activity) => {
                      return (
                        <Row className="d-flex flex-row">
                          <Col>Ttile: {activity.title}</Col>
                          <Col>
                            {/* Display just day and month */}
                            Start Date:{" "}
                            {activity.startDate.split("/")[0] +
                              "/" +
                              activity.startDate.split("/")[1]}
                          </Col>
                          <Col>Start Time: {activity.startTime}</Col>
                        </Row>
                      );
                    })}
                  </Col>
                  <Col>
                    {/* <Row className="d-flex flex-row"> */}
                    <Link
                      className="create_event_links d-flex"
                      variant="dark"
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        newActivity();
                      }}
                    >
                      <Row className="mt-4">
                        <Col md="auto">
                          <i>
                            {" "}
                            <PlusCircleDotted />
                          </i>
                        </Col>
                        <Col>Add new activity</Col>
                      </Row>
                    </Link>
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
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />

            {/* Confirm */}
            <div className="d-flex justify-content-center">
              <Button
                sx={{
                  color: "white",
                  outline: "#DAA520",
                }}
                className="mt-4"
                variant="outlined"
                onClick={async () => {
                  checkDateAndTime();
                  checkFields();
                  handleSubmit();
                }}
              >
                Confirm
              </Button>
            </div>
          </Box>

          <Modal
            sx={{ overflow: "auto" }}
            open={newActivityPopout}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={popupStyle}>
              <AddNewActivity
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
                activityTitle={activityTitle}
                activityStartDate={activityStartDate}
                activityStartTime={activityStartTime}
                activityEndDate={activityEndDate}
                activityEndTime={activityEndTime}
                activityDescription={activityDescription}
                activityExpandDate={activityExpandDate}
                activityShowEndDate={activityShowEndDate}
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
        </Container>
      </Container>
    </>
  );
};

export default CreateEvent;
