import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { PlusCircleDotted, DashCircleDotted } from "react-bootstrap-icons";
import { Col, Container, Row, Form, Alert } from "react-bootstrap";
// import Button from "@mui/material-next/Button";
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
import { StyledTextField } from "../ui_styles/MuiStyles";
import { hover } from "@testing-library/user-event/dist/hover";

const CreateEvent = () => {
  const today = new Date();
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [eventIsValid, setEventIsValid] = useState(false);
  const [showEndDate, setShowEndDate] = useState("d-none");
  const [expandDate, setExpandDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [isDateAndTimeValid, setIsDateAndTimeValid] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [newActivityPopout, setNewActivityPopout] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const { user } = useUserAuth();

  // Backend references
  const eventsRef = collection(db, "events");

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/home");
  };

  const handleInput = (input, setter) => {
    if (input === "") {
      setter("d-none");
    } else {
      setter("");
    }
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
    const getCurrentDate = () => {
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString();
      const day = today.getDate().toString();
      const hours = today.getHours().toString();
      const minutes = today.getMinutes().toString();

      setCurrentDate(
        year + "-" + month.padStart(2, "0") + "-" + day.padStart(2, "0")
      );
      setCurrentTime(hours.padStart(2, "0") + ":" + minutes.padStart(2, "0"));
    };
    getCurrentDate();
    setIsDateAndTimeValid(true);
    if (startDate === "") {
      setIsDateAndTimeValid(false);
      setError("Please select a start date");
    }
    if (startDate < currentDate) {
      setIsDateAndTimeValid(false);
      setError("Start date can't be in the past");
    }
    if (startTime !== "") {
      if (startTime < currentTime && startDate === currentDate) {
        setIsDateAndTimeValid(false);
        setError("Start time can't be in the past");
      }
    }
    if (endDate !== "") {
      if (endDate < startDate) {
        setIsDateAndTimeValid(false);
        setError("End date can't be before start date");
      }
    }
    if (endDate === "" && endTime !== "") {
      setIsDateAndTimeValid(false);
      setError("Please, select a valid end date");
    }
    if (
      endDate === startDate &&
      startTime !== "" &&
      endTime !== "" &&
      endTime < startTime
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
    console.log(newActivityPopout);
  };

  useEffect(() => {
    checkFields();
  }, [title, description]);

  useEffect(() => {
    checkDateAndTime();
  }, [startDate, startTime, endDate, endTime]);

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
        let formattedStartTime = "";
        let formattedEndDate = "";
        let formattedEndTime = "";

        const formattedStartDate =
          startDate.toDate().getDate().toString().padStart(2, "0") +
          "/" +
          (startDate.toDate().getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          startDate.toDate().getFullYear().toString();

        if (startTime) {
          formattedStartTime =
            startTime.toDate().getHours().toString() +
            ":" +
            startTime.toDate().getMinutes().toString().padStart(2, "0");
        }
        if (endDate) {
          formattedEndDate =
            endDate.toDate().getDate().toString().padStart(2, "0") +
            "/" +
            (endDate.toDate().getMonth() + 1).toString().padStart(2, "0") +
            "/" +
            endDate.toDate().getFullYear().toString();
        }
        if (endTime) {
          formattedEndTime =
            startTime.toDate().getHours().toString() +
            ":" +
            startTime.toDate().getMinutes().toString().padStart(2, "0");
        }
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
            {/* //TODO find how to set max chars for input  */}
            <StyledTextField
              className="mt-3 mb-3 w-100 text-light"
              required
              variant="outlined"
              id="outline-required"
              label="Event Title"
              defaultValue=""
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
              onChange={(e) => {
                setSubtitle(e.target.value);
              }}
            />

            {/* Date and time picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Row className="mt-2 mb-3">
                <Col>
                  <DatePicker
                    className="w-100"
                    label="Start date"
                    openTo="day"
                    views={["month", "year", "day"]}
                    inputFormat="DD/MM/YYYY"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={(params) => <StyledTextField {...params} />}
                  />
                </Col>

                <Col>
                  <TimePicker
                    className="w-100"
                    label="Start time"
                    value={startTime}
                    onChange={setStartTime}
                    renderInput={(params) => <StyledTextField {...params} />}
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
                    renderInput={(params) => <StyledTextField {...params} />}
                  />
                </Col>

                <Col>
                  <TimePicker
                    className="w-100"
                    label="End time"
                    value={endTime}
                    onChange={setEndTime}
                    renderInput={(params) => <StyledTextField {...params} />}
                  />
                </Col>
              </Row>
            </LocalizationProvider>

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
              <Col
                className="d-flex mb-3 fs-2 fw-normal justify-content-center"
                onClick={() => {
                  console.log("ON click");
                }}
              >
                Activities
              </Col>
              <Col className="mb-3 d-flex justify-content-left">
                <Link
                  className="create_event_links"
                  variant="dark"
                  style={{ textDecoration: "none" }}
                  onClick={newActivity}
                >
                  <Row className="">
                    <Col>
                      <i>
                        {" "}
                        <PlusCircleDotted />
                      </i>
                    </Col>
                    <Col md="auto" className="">
                      Add new activity
                    </Col>
                  </Row>
                </Link>
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
                  color: "#DAA520",
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
          <AddNewActivity
            trigger={newActivityPopout}
            setTrigger={setNewActivityPopout}
            eventStartDate={startDate}
            eventStartTime={startTime}
            eventEndDate={endDate}
            eventEndTime={endTime}
          />
        </Container>
      </Container>
    </>
  );
};

export default CreateEvent;
