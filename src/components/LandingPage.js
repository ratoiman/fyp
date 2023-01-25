import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

const LandingPage = (props) => {
  const navigate = useNavigate();
  let { user } = useUserAuth();

  const handleNavigation = () => {
    if (user) {
      navigate("/home");
    } else {
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
    const currentUser = JSON.parse(localStorage.getItem("user")).email;
    return (
      <div>
        <Button onClick={handleNavigation}>Home Page</Button>
        <p>Welcome    {currentUser}</p>
      </div>
    );
  }

  if (localStorage.getItem("user") != null) {
    return <GreetUser />;
  } else {
    return <GreetGuest />;
  }
};

export default LandingPage;
