import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Form, Alert, InputGroup, Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const { signUp, user } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (password === confirmPassword) {
        await signUp(email, password);
        navigate("/login");
      } else {
        setError("Passwords don't match");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = (evnt) => {
    setPassword(evnt.target.value);
  };

  const handleConfirmPasswordChange = (evnt) => {
    setConfirmPassword(evnt.target.value);
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const toggleConfirmPassword = () => {
    if (confirmPasswordType === "password") {
      setConfirmPasswordType("text");
      return;
    }
    setConfirmPasswordType("password");
  };

  if (localStorage.getItem("user") != null) {
    console.log("User logged in, redirected from Signup page");
    return <Navigate to="/home" />;
  } else {
    return (
      <Container className="login-container">
        <div className="card p-4 box mt-4">
          <h2 className="mb-3 text-body">DuckyEvents Signup</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Email address field */}
          {/* @TODO: Add a way to cycle through the input fields using enter */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </Form.Group>

            {/* Password field */}

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

            {/* Confirm password field */}

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <InputGroup className="mb-3">
                <Form.Control
                  type={confirmPasswordType}
                  placeholder="Confirm your password"
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword}
                  name="password"
                  className="form-control"
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={toggleConfirmPassword}
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
                Sign up
              </Button>
            </div>
          </Form>
        </div>
        <div className="card p-1 box mt-3 text-center text-muted">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </Container>
    );
  }
};

export default Signup;
