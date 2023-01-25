import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

const LandingPage = (props) => {
  const navigate = useNavigate();
  let { user } = useUserAuth();

  const handleNavigation = () => {
    if (user) {
      console.log("Navigating to home page");
      console.log(user);
      console.log("-------------------------");
      navigate("/home");
    } else {
      console.log("Navigating to login page");
      console.log(user);
      console.log("-------------------------");
      navigate("/login");
    }
  };

  function GreetGuest() {
    return (
      <div>
        <Button onClick={handleNavigation}>Log in</Button>
      </div>
    );
  }

  function GreetUser() {
    return (
      <div>
        <Button onClick={handleNavigation}>Home Page</Button>
      </div>
    );
  }

  if (user) {
    console.log(user);
    return <GreetUser />;
  } else {
    return <GreetGuest />;
  }
};

export default LandingPage;
