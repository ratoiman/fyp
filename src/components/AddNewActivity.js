import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import { PlusCircleDotted, DashCircleDotted } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import "./../css/NewActivity.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StyledTextField, pickerStyle } from "../ui_styles/MuiStyles";

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
  const [startDate, setStartDate] = useState(eventStartDate);
  const [startTime, setStartTime] = useState(props.activityStartTime);
  const [endDate, setEndDate] = useState(props.activityEndDate);
  const [endTime, setEndTime] = useState(props.activityEndTime);
  const [expandDate, setExpandDate] = useState("");
  const [description, setDescription] = useState(props.activityDescription);
  const [showEndDate, setShowEndDate] = useState("d-none");
  let activityDetails = new Object();

  const showDate = () => {
    if (showEndDate === "") {
      setShowEndDate("d-none");
      setExpandDate("");
    } else {
      setShowEndDate("");
      setExpandDate("d-none");
    }
  };

  const saveActivity = () => {
    activityDetails.title = title;
    // TODO format dates and time
    // TODO create a prop in Create New Event to remember the state of End date and time button
    activityDetails.startDate = startDate;
    activityDetails.startTime = startTime;
    activityDetails.endDate = endDate;
    activityDetails.endTime = endTime;
    activityDetails.description = description;
    // console.log(activityDetails);
  };

  const handleSubmit = () => {
    saveActivity();
    props.saveActivity(activityDetails);

    // Cleanup activity states from CreateEvent

    props.setActivityTitle("");
    props.setActivityStartDate(null);
    props.setActivityStartTime(null);
    props.setActivityEndDate(null);
    props.setActivityEndTime(null);
    props.setActivityDescription("");
    props.setTrigger(false);
  };

  useEffect(() => {
    saveActivity();
  }, [title, startDate, endDate, startTime, endTime, description]);

  return props.trigger ? (
    <>
      <Container className="justify-content-center">
        <div className="">
          <h1 style={{ color: "#DAA520" }}>Add New Activity</h1>

          <StyledTextField
            className="mt-3 mb-3 w-100 text-light"
            required
            variant="outlined"
            id="outline-required"
            label="Event Title"
            defaultValue={title}
            onChange={(e) => {
              props.setActivityTitle(e.target.value);
              setTitle(e.target.value);
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* Start date */}
            <Row className="mt-2 mb-3">
              <Col>
                <DatePicker
                  minDate={eventStartDate}
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
                    <StyledTextField sx={pickerStyle} {...params} />
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
                    <StyledTextField sx={pickerStyle} {...params} />
                  )}
                />
              </Col>
            </Row>

            {/* End date */}
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
                    props.setActivityEndDate(newValue);
                    setEndDate(newValue);
                  }}
                  renderInput={(params) => (
                    <StyledTextField sx={pickerStyle} {...params} />
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
                    <StyledTextField sx={pickerStyle} {...params} />
                  )}
                />
              </Col>
            </Row>
          </LocalizationProvider>

          {/* Expand dates button */}
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

          {/* Description */}
          <StyledTextField
            className="mt-3 mb-3 w-100 text-light"
            required
            multiline
            id="outline-basic"
            label="Event Description"
            defaultValue={description}
            onChange={(e) => {
              props.setActivityDescription(e.target.value);
              setDescription(e.target.value);
            }}
          />

          <Button
            variant="outlined"
            onClick={() => {
              props.setTrigger(false);
            }}
          >
            Close
          </Button>
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Container>
    </>
  ) : (
    ""
  );
};

export default AddNewActivity;
