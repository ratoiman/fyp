import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";

function App() {
  return (
    <Container
      className="p-4 wrapper"
      fluid
    >
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
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
