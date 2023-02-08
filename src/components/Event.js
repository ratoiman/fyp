import React from "react";
import { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

const Event = ({
  title,
  subtitle,
  start_date,
  start_time,
  end_date,
  end_time,
  description,
  author,
}) => {
  const [viewStartTime, setViewStartTime] = useState("d-none");
  const [viewEndDate, setViewEndDate] = useState("d-none");
  const [viewEndTime, setViewEndTime] = useState("d-none");
  const setVisible = (view, setter) => {
    if (view) {
      setter("");
    }
  };

  useState(() => {
    setVisible(start_time, setViewStartTime);
  }, [start_time]);

  useState(() => {
    setVisible(end_date, setViewEndDate);
  }, [end_date]);
  useState(() => {
    setVisible(end_time, setViewEndTime);
  }, [end_time]);

  {
    console.log(
      "EVENT Title: ",
      title,
      "EVENT end date: ",
      end_date,
      "View end date: ",
      viewEndDate
    );
  }
  return (
    <Container className="card p-4 box mt-4 text-white bg-black w-50  ">
      <div>
        <h1>{title}</h1>
      </div>
      <div>{subtitle}</div>
      <div>
        <Row className="mt-2">
          <Col>Start date:{start_date}</Col>
          <Col className={`${viewStartTime}`}>Start time:{start_time}</Col>
        </Row>
      </div>
      <div>
        <Row className="mt-2 mb-2">
          <Col className={`${viewEndDate}`}>End date:{end_date}</Col>
          <Col className={`${viewEndTime}`}>End time:{end_time}</Col>
        </Row>
      </div>
      <div>
        <h3 className="mt-3">Description:</h3>
      </div>
      <div>{description}</div>
      <div className="mt-3 text-secondary">Event created by: {author}</div>
    </Container>
  );
};

export default Event;
