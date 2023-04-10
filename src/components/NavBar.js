import React from "react";
import { Button } from "@mui/material";
import { useState } from "react";
import {
  topbar_buttons,
  sidebar_buttons,
  submitButtonTheme,
} from "../ui_styles/MuiStyles";
import Box from "@mui/material/Box";
import "../css/components.css";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import EventIcon from "@mui/icons-material/Event";
import AddToQueueOutlinedIcon from "@mui/icons-material/AddToQueueOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { ThemeProvider } from "@mui/material/styles";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const NavBar = () => {
  const [expand, setExpand] = useState(false);
  const navigator = useNavigate();
  const { logOut, user } = useUserAuth();

  const navigate = (dst) => {
    navigator(dst);
  };

  const handleHome = () => {
    navigate("/home");
  };

  const handleMyEvents = () => {
    navigate("/");
  };

  const handleNewEvent = () => {
    navigate("/newevent");
  };

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

  const handleLogin = () => {
    navigate("/login");
  };

  if (isMobile) {
    return (
      <ThemeProvider theme={submitButtonTheme}>
        <Stack
          direction="row"
          spacing={0}
          sx={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <Button
            sx={topbar_buttons}
            variant="text"
            startIcon={<HomeOutlinedIcon />}
            onClick={handleHome}
          >
            home
          </Button>
          <Button
            startIcon={<EventIcon />}
            variant="text"
            sx={topbar_buttons}
            onClick={handleMyEvents}
          >
            My Events
          </Button>
          <Button
            startIcon={<AddToQueueOutlinedIcon />}
            variant="text"
            sx={topbar_buttons}
            onClick={handleNewEvent}
          >
            New event
          </Button>
          <Button
            startIcon={user === null ? <LoginIcon /> : <LogoutIcon />}
            variant="text"
            sx={topbar_buttons}
            onClick={user === null ? handleLogin : handleLogout}
          >
            {user === null ? "Login" : "Logout"}
          </Button>
        </Stack>
      </ThemeProvider>
    );
  } else {
    return (
      <Box>
        <Box className="sidebar">
          <ThemeProvider theme={submitButtonTheme}>
            <Stack spacing={3}>
              <Button
                className="mt-2"
                variant="text"
                sx={sidebar_buttons}
                startIcon={<MenuIcon />}
                onClick={() => setExpand(!expand)}
              >
                MENU{" "}
              </Button>
              <Box display={expand === false ? "none" : ""}>
                <Stack spacing={3}>
                  <Button
                    sx={sidebar_buttons}
                    variant="text"
                    startIcon={<HomeOutlinedIcon />}
                    onClick={handleHome}
                  >
                    Home
                  </Button>
                  <Button
                    startIcon={<EventIcon />}
                    variant="text"
                    sx={sidebar_buttons}
                    onClick={handleMyEvents}
                  >
                    My Events
                  </Button>
                  <Button
                    className="mb-2"
                    startIcon={<AddToQueueOutlinedIcon />}
                    variant="text"
                    sx={sidebar_buttons}
                    onClick={handleNewEvent}
                  >
                    New event
                  </Button>
                  <Button
                    className="mb-2"
                    startIcon={user === null ? <LoginIcon /> : <LogoutIcon />}
                    variant="text"
                    sx={sidebar_buttons}
                    onClick={user === null ? handleLogin : handleLogout}
                  >
                    {user === null ? "Login" : "Logout"}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </ThemeProvider>
        </Box>
      </Box>
    );
  }
};

export default NavBar;
