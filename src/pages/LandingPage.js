import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useUserAuth } from "../context/UserAuthContext";
import Event from "../components/Event";

const LandingPage = () => {
  const navigate = useNavigate();
  const [userEvents, setUserEvents] = useState([]);
  const [userEventsDetails, setUserEventsDetails] = useState([]);
  const [newName, setNewName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [newAge, setAge] = useState(0);
  const [updatedAge, setUpdatedAge] = useState(0);
  const { user } = useUserAuth();

  const handleNavigation = () => {
    if (Object.keys(user).length !== 0) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  const getUserEvents = () => {
    try {
      if (user !== null) {
        if (Object.keys(user).length !== 0) {
          const usersRef = collection(db, "users", user.uid, "events");
          onSnapshot(usersRef, async () => {
            const data = await getDocs(usersRef);
            setUserEvents(
              data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getEventsDetails = () => {
    userEvents.map(async (event) => {
      console.log("user events set map");
      const eventRef = doc(db, "events", event.id, "data", "event_details");
      const eventDetailsDoc = await getDoc(eventRef);
      console.log("eventDetailsDoc ", eventDetailsDoc.data());
      setUserEventsDetails((eventDetails) => [
        ...eventDetails,
        eventDetailsDoc.data(),
      ]);
    });
  };

  useEffect(() => {
    getUserEvents();
  }, [user]);

  useEffect(() => {
    getEventsDetails();
  }, [userEvents]);

  function GreetGuest() {
    return (
      <div>
        Hi guest
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

  // if (localStorage.getItem("user") === null) {
  //   return (
  //     <>
  //       <GreetGuest />
  //     </>
  //   );
  // } else {
  //   return (
  //     <>
  //       {/* {users.map((user) => {
  //         return (
  //           <Container className="card p-4 box mt-4 text-white bg-black w-50 ">
  //             <div>
  //               <h1>username: {user.username}</h1>
  //               <input
  //                 placeholder="Change age"
  //                 onChange={(event) => {
  //                   setUpdatedAge(event.target.value);
  //                 }}
  //               />
  //               <Button
  //                 onClick={() => {
  //                   updateUser(user.id, updatedAge);
  //                 }}
  //               >
  //                 submit
  //               </Button>
  //             </div>
  //             <div>
  //               <Button
  //                 size="sm"
  //                 variant="outline-danger"
  //                 className="fw-bold"
  //                 onClick={() => {
  //                   deleteUser(user.id);
  //                 }}
  //               >
  //                 {" "}
  //                 Delete user
  //               </Button>
  //             </div>
  //           </Container>
  //         );
  //       })} */}
  //       <GreetUser />
  //     </>
  //   );
  // }

  const handleNav = (nav) => {
    navigate(nav);
  };

  // const listEvents = userEvents.map((event) => {
  //   const eventRef = doc(db, "events", event.id, "data", "event_details");
  //   const eventDetails = getDoc(eventRef);
  // });

  console.log("Username ",user.displayName)

  return (
    <>
      <Button
        onClick={() => {
          handleNav("/home");
        }}
      >
        Home
      </Button>
      <Button
        onClick={() => {
          handleNav("/login");
        }}
      >
        Login
      </Button>{" "}
      {userEventsDetails.map((eventDetails) => {
        return (
          <Event
            title={eventDetails.title}
            subtitle={eventDetails.subtitle}
            start_date={eventDetails.start_date}
            start_time={eventDetails.start_time}
            end_date={eventDetails.end_date}
            end_time={eventDetails.end_time}
            description={eventDetails.description}
            author={eventDetails.author_username}
          />
        );
        // console.log("Event",event.id)
      })}
    </>
  );
};

export default LandingPage;
