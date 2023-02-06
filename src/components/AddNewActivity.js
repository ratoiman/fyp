import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import "./../css/NewActivity.css";

const AddNewActivity = (props) => {
  // TODO fix the poput width to the new event width
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(props.eventStartDate);
  const [startTime, setStartTime] = useState(props.eventStartTime);
  const [endDate, setEndDate] = useState(props.eventEndDate);
  const [endTime, setEndTime] = useState(props.eventEndTime);
  const [showTitle, setShowTitle] = useState("d-none");
  const [showSubtitle, setShowSubtitle] = useState("d-none");
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

  useEffect(() => {
    handleInput(title, setShowTitle);
  }, [title]);

  useEffect(() => {
    handleInput(subtitle, setShowSubtitle);
  }, [subtitle]);

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
