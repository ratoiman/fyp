import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { PlusCircleDotted, DashCircleDotted } from "react-bootstrap-icons";
import { Button, Col, Container, Row, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import AddNewActivity from "./AddNewActivity";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";

const CreateEvent = () => {
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [eventIsValid, setEventIsValid] = useState(false);
  const [showTitle, setShowTitle] = useState("d-none");
  const [showSubtitle, setShowSubtitle] = useState("d-none");
  const [showDescription, setShowDescription] = useState("d-none");
  const [showEndDate, setShowEndDate] = useState("d-none");
  const [expandDate, setExpandDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startDateFormatted, setStartDateFormatted] = useState("");
  const [endDateFormatted, setEndDateFormatted] = useState("");
  const [isDateAndTimeValid, setIsDateAndTimeValid] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newActivityPopout, setNewActivityPopout] = useState(false);
  const [endTime, setEndTime] = useState("");
  const { user } = useUserAuth();
  const today = new Date();

  // Backend references
  const eventsRef = collection(db, "events");

  const navigate = useNavigate();

  const formatDate = (date, setter) => {
    if (date !== "") {
      const datePart = date.match(/\d+/g);
      const year = datePart[0].substring(0, 4);
      const month = datePart[1];
      const day = datePart[2];
      setter(day + "-" + month + "-" + year);
    }
  };

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
      formatDate(startDate, setStartDateFormatted);
      formatDate(endDate, setEndDateFormatted);
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
    handleInput(title, setShowTitle);
    checkFields();
  }, [title]);

  useEffect(() => {
    handleInput(subtitle, setShowSubtitle);
  }, [subtitle]);

  useEffect(() => {
    handleInput(description, setShowDescription);
    checkFields();
  }, [description]);

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
        await setDoc(eventDetailsRef, {
          title: title,
          subtitle: subtitle,
          start_date: startDateFormatted,
          start_time: startTime,
          end_date: endDateFormatted,
          end_time: endTime,
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
        className="card p-4 box mt-4 bg-black square rounded-9 border border-2"
        style={{ minWidth: "50%", maxWidth: "60%" }}
      >
        <Row>
          <h1 className="d-flex mb-3 fw-bold text-light justify-content-center">
            Create new event
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
          <Form>
            {/* Event Title */}
            <Form.Group>
              <Form.Label
                className={`fs-6 fw-normal d-flex mb-3 text-light  ms-1 mt-1 ${showTitle}`}
              >
                Event Title
                <text className="fs-6 fw-normal text-secondary ms-2">
                  (required)
                </text>
              </Form.Label>
              <Form.Control
                maxLength={50}
                type="text"
                placeholder="Event title (required)"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <p className="fs-6 fw-normal text-secondary">
                *max 50 characters
              </p>
            </Form.Group>
            {/* Event Subtitle */}
            <Form.Group>
              <Row>
                <Form.Label
                  className={`fs-6 fw-normal d-flex mb-3 text-light ms-1 mt-1 ${showSubtitle}`}
                >
                  Event Subtitle
                  <text className="fs-6 fw-normal text-secondary ms-2 d-flex">
                    (optional)
                  </text>
                </Form.Label>
              </Row>
              <Form.Control
                maxLength={50}
                type="text"
                placeholder="Event Subtitle"
                onChange={(e) => {
                  setSubtitle(e.target.value);
                }}
              />
              <p className="fs-6 fw-normal text-secondary">
                *max 50 characters
              </p>
            </Form.Group>
            {/* Date and time picker */}
            <Row className="mb-4">
              <Col>
                <Form.Group>
                  <Form.Label>Start date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Start Date"
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      checkDateAndTime();
                    }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Start time</Form.Label>
                  <Form.Control
                    type="time"
                    placeholder="Start time"
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      checkDateAndTime();
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className={`mb-3 ${showEndDate}`}>
              <Col>
                <Form.Group>
                  <Form.Label>End date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="End Date"
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      checkDateAndTime();
                    }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>End time</Form.Label>
                  <Form.Control
                    type="time"
                    placeholder="Start Date"
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      checkDateAndTime();
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

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
            <Form.Group>
              <Row>
                <Form.Label
                  className={`fs-6 fw-normal d-flex mb-3 text-light ms-1 mt-1 ${showDescription}`}
                >
                  Event Description
                  <text className="fs-6 fw-normal text-secondary ms-2 d-flex">
                    (required)
                  </text>
                </Form.Label>
              </Row>
              <Form.Control
                as="textarea"
                type="text"
                placeholder="Event Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </Form.Group>
            {/* Confirm */}
            <div className="d-flex justify-content-center">
              <Button
                className="text-black mt-4"
                variant="primary"
                onClick={async () => {
                  checkDateAndTime();
                  checkFields();
                  handleSubmit();
                }}
              >
                Confirm
              </Button>
            </div>
          </Form>
          <AddNewActivity
            trigger={newActivityPopout}
            setTrigger={setNewActivityPopout}
            eventStartDate={startDate}
            eventStartTime = {startTime}
            eventEndDate = {endDate}
            eventEndTime = {endTime}
          />
        </Container>
      </Container>
    </>
  );
};

export default CreateEvent;
