import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../utils/firebase";

const LandingPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [newAge, setAge] = useState(0);
  const [updatedAge, setUpdatedAge] = useState(0);
  const usersRef = collection(db, "users");

  // let { user } = useUserAuth();

  const handleNavigation = () => {
    if (JSON.parse(localStorage.getItem("user")) != null) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(usersRef);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (e) {
        console.log(e);
      }
    };
    getUsers();
  }, []);

  function GreetGuest() {
    return (
      <div>
        <Button onClick={handleNavigation}>Log in</Button>
      </div>
    );
  }

  function GreetUser() {
    const currentUser = JSON.parse(localStorage.getItem("user")).email;
    return (
      <div>
        <Button onClick={handleNavigation}>Home Page</Button>
        <p>Welcome {currentUser}</p>
      </div>
    );
  }

  const createUser = async () => {
    await addDoc(usersRef, { name: newName, surname: newSurname, age: newAge });
  };

  const updateUser = async (id, updatedAge) => {
    const userDoc = doc(db, "users", id);
    const NewFields = { age: updatedAge };
    await updateDoc(userDoc, NewFields);
  };

  if (localStorage.getItem("user") != null) {
    return (
      <>
        {users.map((user) => {
          return (
            <Container className="card p-4 box mt-4 text-white bg-black w-50 ">
              <div>
                <h1>Name: {user.name}</h1>
                <h1>Surname: {user.surname}</h1>
                <h1>Age: {user.age}</h1>
              </div>
            </Container>
          );
        })}
        <GreetUser />
      </>
    );
  } else {
    return (
      <>
        <input
          placeholder="Name..."
          onChange={(event) => {
            setNewName(event.target.value);
          }}
        />
        <input
          placeholder="Surname..."
          onChange={(event) => {
            setNewSurname(event.target.value);
          }}
        />
        <input
          placeholder="Age..."
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <button onClick={createUser}>Create user</button>

        {users.map((user) => {
          return (
            <Container className="card p-4 box mt-4 text-white bg-black w-50 ">
              <div>
                <h1>Name: {user.name}</h1>
                <h1>Surname: {user.surname}</h1>
                <h1>Age: {user.age}</h1>
                <input placeholder="Change age" 
                onChange={(event) => {
                  setUpdatedAge(event.target.value);
                }}/>
                <button
                  onClick={() => {
                    updateUser(user.id, updatedAge);
                  }}
                >
                  submit
                </button>
              </div>
            </Container>
          );
        })}
        <GreetGuest />
      </>
    );
  }
};

export default LandingPage;
