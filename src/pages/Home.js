import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Home = () => {
  // eslint-disable-next-line
  const { logOut, user } = useUserAuth();
  const currentUser = JSON.parse(localStorage.getItem("user")).email;
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      if (localStorage.getItem("user") != null) {
        localStorage.removeItem("user");
      }
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLanding = () => {
    navigate("/");
  };

  const handleCreateEvent = () => {
    navigate("/newevent")
  };
        
  return (
    <>
      <div className="p-4 box mt-3 text-center">
      <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Typography variant="h6">Welcome </Typography><br />
        {/* {user && user.email} */}
       <Typography variant="h5"> {currentUser}
       </Typography>
       </Box>
      </div>
      <Container className="login-container">
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={handleLogout}>
            Log out
          </Button>
          <Button variant="primary" onClick={handleLanding}>
            Landing Page
          </Button>

          <Button variant="primary" onClick={handleCreateEvent}>
            Create Event
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Home;
