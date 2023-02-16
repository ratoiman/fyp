import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import UserSetup from "./pages/UserSetup";
import CreateEventMUI from "./components/CreateEventMUI";
import EventPage from "./pages/EventPage";
import NavBar from "./components/NavBar";
import { isMobile } from "react-device-detect";
import { Box, Stack } from "@mui/material";

function App() {
  if (isMobile === true) {
    return (
      <>
        <Stack className="root-container">
          <UserAuthContextProvider>
            <Box className="topbar">
              {" "}
              <NavBar />
            </Box>
            <Box>
              <Container className="" fluid>
                <Row className="row d-flex flex-column ">
                  {/* <Col md="auto"> */}

                  {/* </Col> */}
                  <Col>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/event" element={<EventPage />} />
                      <Route
                        path="/home"
                        element={
                          <ProtectedRoute>
                            <Home />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/userdetails"
                        element={
                          <ProtectedRoute>
                            <UserSetup />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/newevent"
                        element={
                          <ProtectedRoute>
                            <CreateEventMUI />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </Col>
                </Row>
              </Container>
            </Box>
          </UserAuthContextProvider>
        </Stack>
      </>
    );
  } else {
    return (
      <>
        <Container className=" wrapper" fluid>
          <Row className="row">
            <UserAuthContextProvider>
              <Col xs={2} className="d-flex">
                <NavBar />
              </Col>
              <Col>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/event" element={<EventPage />} />
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/userdetails"
                    element={
                      <ProtectedRoute>
                        <UserSetup />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/newevent"
                    element={
                      <ProtectedRoute>
                        <CreateEventMUI />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Col>
            </UserAuthContextProvider>
          </Row>
        </Container>
      </>
    );
  }
}

export default App;
