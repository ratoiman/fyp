import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { PlusCircleDotted, DashCircleDotted } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import "./../css/NewActivity.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";

const AddNewActivity = (props) => {
  // TODO fix the poput width to the new event width
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState(props.eventStartTime);
  const [endDate, setEndDate] = useState(props.eventEndDate);
  const [endTime, setEndTime] = useState(props.eventEndTime);
  const [showTitle, setShowTitle] = useState("d-none");
  const [expandDate, setExpandDate] = useState("");
  const [showDescription, setShowDescription] = useState("d-none");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [showEndDate, setShowEndDate] = useState("d-none");

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

  useEffect(() => {
    handleInput(title, setShowTitle);
  }, [title]);

  useEffect(() => {
    handleInput(description, setShowDescription);
  }, [description]);

  return props.trigger ? (
    <>
      <Container className="popup mt-1">
        <div className="mt-1 popup-inner">
          <h1>Add New Activity</h1>

          <Form>
            {/* Event Title */}
            <Form.Group>
              <Form.Label
                className={`fs-6 fw-normal d-flex mb-3 text-light  ms-1 mt-1 ${showTitle}`}
              >
                Activity title
                <text className="fs-6 fw-normal text-secondary ms-2">
                  (required)
                </text>
              </Form.Label>
              <Form.Control
                maxLength={50}
                type="text"
                placeholder="Activity title (required)"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <p className="fs-6 fw-normal text-secondary">
                *max 50 characters
              </p>
            </Form.Group>

            {/* <Form.Group> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Row className="m-1 d-flex flex-row justify-content-center">
                <Col md="auto">
                  <DatePicker
                    label="Start date"
                    openTo="day"
                    views={["month", "year", "day"]}
                    minDate={props.eventStartDate}
                    inputFormat="DD/MM/YYYY"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Col>

                <Col md="auto">
                  <TimePicker
                    label="Start time"
                    value={startTime}
                    onChange={setStartTime}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Col>
              </Row>

              <Row
                className={`mt-4 m-1 d-flex flex-row justify-content-center ${showEndDate}`}
              >
                <Col md="auto">
                  <DatePicker
                    label="End date"
                    openTo="day"
                    views={["month", "year", "day"]}
                    maxDate={props.eventEndDate}
                    inputFormat="DD/MM/YYYY"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Col>

                <Col md="auto">
                  <TimePicker
                    label="End time"
                    value={endTime}
                    onChange={setEndTime}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Col>
              </Row>
            </LocalizationProvider>

            <Link
              className="d-flex  justify-content-left mb-4 create_event_links"
              style={{ textDecoration: "none" }}
              onClick={showDate}
            >
              <Row className="mt-2">
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
          </Form>

          <Button onClick={() => props.setTrigger(false)}>Close</Button>
        </div>
      </Container>
    </>
  ) : (
    ""
  );
};

export default AddNewActivity;
