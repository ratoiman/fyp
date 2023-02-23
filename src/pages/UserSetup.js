import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Alert, Container, Row } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import  {updateProfile}  from "firebase/auth";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const UserSetup = () => {
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [userlist, setUserlist] = useState([]);
  const [username, setUsername] = useState("");
  const [userValid, setUserValid] = useState(false);
  const [nameValid, setNameValid] = useState(false);
  const [surnameValid, setSurnameValid] = useState(false);
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

  const checkName = (name) => {
    setName(
      name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase()
    );
    setNameValid(Boolean(name.match(/^[A-Za-z]*$/)));
    if (!nameValid) {
      setError("Invalid name, please check name only has letters");
      console.log("Name ", nameValid, name);
    }
  };

  const checkSurname = (surname) => {
    setSurname(
      surname.trim().charAt(0).toUpperCase() +
        surname.trim().slice(1).toLowerCase()
    );
    setSurnameValid(Boolean(surname.match(/^[A-Za-z]*$/)));

    if (!surnameValid) {
      setError("Invalid surname, please check surname only has letters");
      console.log("Surname ", surnameValid, surname);
    }
  };

  const checkUsername = (username) => {
    const found = userlist.some((el) => el.id === username);
    if (username !== "" && username.length > 2) {
      setUserValid(!found);
    } else {
      setUserValid("");
    }

    if (!userValid && found) {
      setError("Username already exists");
    }
  };

  const handleSubmit = async (e) => {
    const setUserDetails = async (userCredential) => {
      console.log("UID: ", userCredential.uid);
      const detailsRef = doc(db, "users", userCredential.uid);

      const stateRef = doc(
        db,
        "users",
        userCredential.uid,
        "user_profile",
        "user_states"
      );

      const usernamesRef = doc(db, "usernames", username);

      await setDoc(detailsRef, {
        email: userCredential.email,
        name: name,
        surname: surname,
        username: username,
        type: "guest",
      });

      await setDoc(stateRef, {
        userSetUp: true,
      });

      await setDoc(usernamesRef, {
        uid: userCredential.uid,
      });

      await updateProfile(userCredential ,{
        displayName: username,
      });

      if (localStorage.getItem("user") === null) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    };

    e.preventDefault();
    try {
      checkSurname(surname);
      checkName(name);
      checkUsername(username);

      if (nameValid && surnameValid && userValid) {
        console.log("Success ", name, " ", surname, " ", username);
        setUserDetails(user);
        navigate("/login");
      } else {
        console.log("Failure", name, " ", surname, " ", username);
        setShowAlert(true);
      }
    } catch (e) {
      setError(e.message);
      setShowAlert(true);
    }
  };

  useEffect(() => {
    getUsernames();
  }, []);
  useEffect(() => {
    checkUsername(username);
  }, [username]);

  console.log("User setup user: ", user.email);
  return (
    <>
      <Container className="login-container">
        <div className="card p-4 box mt-4">
          <h2 className="mb-3 text-body">User details</h2>
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
          {/* Name */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Row className="justify-content-md-left">
                <Form.Label className="fs-5 fw-normal text-dark">
                  Name
                  <text className="fs-6 fw-normal text-secondary ms-1">
                    (required)
                  </text>
                </Form.Label>
              </Row>
              <Form.Control
                maxLength={25}
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value.trim());
                  checkName(e.target.value.trim());
                }}
              />
              <p className="fs-6 fw-normal text-secondary">
                *max 25 characters
              </p>
            </Form.Group>

            {/* Surname */}
            <Form.Group className="mb-3">
              <Row className="justify-content-md-left">
                <Form.Label className="fs-5 fw-normal text-dark">
                  Surname
                  <text className="fs-6 fw-normal text-secondary ms-1">
                    (required)
                  </text>
                </Form.Label>
              </Row>
              <Form.Control
                maxLength={25}
                type="text"
                placeholder="Surname"
                onChange={(e) => {
                  setSurname(e.target.value.trim());
                  checkSurname(e.target.value.trim());
                }}
              />
              <p className="fs-6 fw-normal text-secondary">
                *max 25 characters
              </p>
            </Form.Group>

            {/* Username */}
            <Form.Group className="mb-3">
              <Row className="justify-content-md-left">
                <Form.Label className="fs-5 fw-normal text-dark">
                  Username
                  <text className="fs-6 fw-normal text-secondary ms-1">
                    (required)
                  </text>
                </Form.Label>
              </Row>
              <Form.Control
                maxLength={25}
                type="text"
                placeholder="username"
                isValid={userValid}
                value={username}
                onChange={(e) => {
                  const result = e.target.value.toLowerCase();
                  setUsername(result);
                  checkUsername(username);
                  console.log(userValid, username);
                }}
              />
              <p className="fs-6 fw-normal text-secondary">
                *between 3 and 25 characters
              </p>
            </Form.Group>

            {/* Profile picture */}
            <Form.Group controlId="formFile" className="mb-3">
              <Row className="justify-content-md-left">
                <Form.Label className="fs-5 fw-normal text-dark">
                  Profile picture{" "}
                  <text className="fs-6 fw-normal text-secondary">
                    (optional)
                  </text>
                </Form.Label>
              </Row>
              <Form.Control placeholder="Profile picture" type="file" />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button className="login-buttons" variant="primary" type="Submit">
                Confirm
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default UserSetup;
