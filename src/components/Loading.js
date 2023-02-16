import React from "react";
import { RingLoader} from "react-spinners";
import { Container } from "react-bootstrap";

const Loading = () => {
  return (
    <>
      {console.log("loading")}
      <Container className="loading">
        <RingLoader size="100px" color="#DAA520" />
      </Container>
    </>
  );
};

export default Loading;
