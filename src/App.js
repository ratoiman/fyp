import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import UserSetup from "./pages/UserSetup";
import CreateEventMUI from "./components/CreateEventMUI";
import NavBar from "./components/NavBar";
import { isMobile } from "react-device-detect";
import { Box, Stack } from "@mui/material";
import MyEvents2 from "./pages/MyEvents2";

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
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <MyEvents2 />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
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
              <Col md={10}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <MyEvents2 />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  {/* <Route
                    path="/event"
                    element={
                      <EventPage
                        eventID={selectedEventID}
                        setEventToOpen={setEventToOpen}
                        setPageToLoad={setPageToLoad}
                      />
                    }
                  /> */}
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
