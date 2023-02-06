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

function App() {
  return (
    <Container className="p-4 wrapper" fluid>
      <Row className="row">
        <Col>
          <UserAuthContextProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
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
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
