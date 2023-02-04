import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Form, Alert, InputGroup, Container, Row } from "react-bootstrap";
import { Button, Col } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { EyeFill, EyeSlashFill, Google } from "react-bootstrap-icons";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState("");
  const { logIn, googleSignIn, user } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePasswordChange = (evnt) => {
    setPassword(evnt.target.value);
  };
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  if (user != null) {
    if (Object.keys(user).length !== 0) {
      console.log("message from login: ",user, " logged in");

      if (localStorage.getItem("user") === null) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      return <Navigate to="/home" />;
    }
  } else {
    return (
      <Container className="login-container">
        <div className="card p-4 box mt-4">
          <h2 className="mb-3 text-body">DuckyEvents Login</h2>
          {error && (
            <Alert variant="danger">
              Authentication Failed, please check email and password
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <InputGroup className="mb-3">
                <Form.Control
                  type={passwordType}
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  value={password}
                  name="password"
                  className="form-control"
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={togglePassword}
                >
                  {passwordType === "password" ? (
                    <i>
                      <EyeFill />
                    </i>
                  ) : (
                    <i>
                      <EyeSlashFill />
                    </i>
                  )}
                </Button>
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button className="login-buttons" variant="primary" type="Submit">
                Log In
              </Button>
            </div>
          </Form>
          <hr />
          <div>
            <div className="d-flex justify-content-center">
              <Button
                className="login-buttons"
                type="dark"
                variant="primary"
                onClick={handleGoogleSignIn}
              >
                <Row className="justify-content-md-center">
                  <Col md="auto">Sign in with Google</Col>
                  <Col xs={2}>
                    <i>
                      {" "}
                      <Google />
                    </i>
                  </Col>
                </Row>
              </Button>
            </div>
          </div>
        </div>
        <div className="card p-1 box mt-3 text-center text-muted">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </Container>
    );
  }
};

export default Login;
