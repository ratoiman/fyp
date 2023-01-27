import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Form, Alert, InputGroup, Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const { signUp } = useUserAuth();
  const [userlist, setUserlist] = useState([]);
  const [username, setUsername] = useState("");
  const [userValid, setUserValid] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useUserAuth();

  const usernamesRef = collection(db, "usernames");
  let navigate = useNavigate();

  const getUsernames = () => {
    try {
      onSnapshot(usernamesRef, async () => {
        const data = await getDocs(usernamesRef);
        setUserlist(data.docs.map((doc) => ({ id: doc.id })));
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUsernames();
  }, []);
  useEffect(() => {
    checkUsername(username);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      checkUsername(username);
      if (password === confirmPassword && userValid) {
        await signUp(email, password, username);
        navigate("/login");
      } else {
        if (!userValid) {
          setError("Username already exists");
        } else {
          setError("Passwords don't match");
        }
        setShowAlert(true);
      }
    } catch (err) {
      setError(err.message);
      setShowAlert(true);
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

  const checkUsername = (username) => {
    const found = userlist.some((el) => el.id === username);
    setUserValid(!found);
  };

  if (localStorage.getItem("user") != null) {
    console.log("User logged in, redirected from Signup page");
    return <Navigate to="/home" />;
  } else {
    return (
      <Container className="login-container">
        <div className="card p-4 box mt-4">
          <h2 className="mb-3 text-body">DuckyEvents Signup</h2>
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

          {/* Email address field */}
          {/* @TODO: Add a way to cycle through the input fields using enter */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email address"
                onChange={(e) => {
                  setEmail(e.target.value.trim());
                }}
              />

              {/* Username field */}
              {/* @TODO: Add a way to cycle through the input fields using enter */}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="username"
                onChange={(e) => {
                  setUsername(e.target.value);

                  checkUsername(username);
                }}
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
