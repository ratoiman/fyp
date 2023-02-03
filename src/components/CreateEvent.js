import React, { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import { PlusCircleDotted, DashCircleDotted } from "react-bootstrap-icons";
import { Button, Col, Container, Row, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
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
  const [startDate, setStartDate] = useState("");
  const [isStartDateValid, setIsStartDateValid] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEndDateValid, setIsEndDateValid] = useState(false);
  const [endTime, setEndTime] = useState("");
  const { user } = useUserAuth();

  const currentDate = new Date();

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

  // TODO implement date and time validity checks
  const checkDate = (date, setter) => {};

  const checkFields = () => {
    if (title.length !== 0 && description.length !== 0) {
      setEventIsValid(true);
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

  const handleSubmit = async () => {
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
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,
          description: description,
          author: user.uid,
        });
        await setDoc(eventRef, { status: "admin" });
        await setDoc(userRef, { status: "admin" });
        console.log("Event created with ID:", docRef.id);
      });
      //   console.log("Event created with id: ", eventsRef.id);
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
        style={{ width: "50%" }}
      >
        <Row>
          <h1 className="d-flex mb-3 text-light justify-content-center">
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
            {/* Title */}
            <Form.Group>
              {/* <Row> */}
              <Form.Label
                className={`fs-6 fw-normal d-flex mb-3 text-light  ms-1 mt-1 ${showTitle}`}
              >
                Event Title
                <text className="fs-6 fw-normal text-secondary ms-2">
                  (required)
                </text>
              </Form.Label>
              {/* </Row> */}
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

            {/* Subtitle */}
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
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              className="bg-transparent outline-none mb-3"
              variant="dark"
              onClick={showDate}
            >
              <Row className="d-flex flex-row">
                <Col xs={2}>
                  <i>
                    {" "}
                    <PlusCircleDotted className={`${expandDate}`} />
                    <DashCircleDotted className={`${showEndDate}`} />
                  </i>
                </Col>
                <Col md="auto">End date and time</Col>
              </Row>
            </Button>

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
                onClick={() => {
                  // const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
                  // console.log(Date.parse(endDate) === Date.parse(startDate));
                  // console.log(endDate > 0);
                  console.log("Clicked confirm");
                  handleSubmit();
                }}
              >
                Confirm
              </Button>
            </div>
          </Form>
        </Container>
      </Container>
    </>
  );
};

export default CreateEvent;
