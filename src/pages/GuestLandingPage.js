import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Login from "./Login";
import { Link } from "react-router-dom";

const GuestLandingPage = () => {
  return (
    <>
      <Container>
        <Row className="d-flex flex-column">
          <Col>WELCOME TO DUCKY EVENTS</Col>
          <Col>The place right place for your event</Col>
          <Col>Find and explore events near you</Col>
        </Row>

        <h2>Want to find enjoy the full experience?</h2>
        <h2><Link to="/login">Login here</Link></h2> 

      
      </Container>
      
    </>
  );
};

export default GuestLandingPage;
