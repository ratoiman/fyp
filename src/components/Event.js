import React from "react";
import { Button, Container } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";

const Event = (type) => {
  const navigator = useNavigate()

  const handleNewEvent = () => {
    navigator("/newevent")
  }

  return (
    <Container className="card p-4 box mt-4 text-white bg-black w-70 h-70 ">
      <div>Event Title</div>
      <div>Event Description</div>
      <div>Event Date</div>
      <div>Event Location</div>
      <Button className="login-button" onClick={handleNewEvent}>New event</Button>
    </Container>
  );
};

export default Event;
